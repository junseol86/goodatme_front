<template>
  <div class="posting-popup">
    <div class="popup_wrapper" :style="{width: layout.windowWidth, height: layout.windowHeight}">
      <div :style="{width: layout.windowWidth}">
        <div id="board" :style="{width: layout.centeredWidth}">
          <img class="trHv"
          :style="{right: layout.closeRight}" id="close" src="../../assets/img/popup_x_72.png" @click="close()"/>
          <div id="topImage" :style="topImageSize">
            <image-bg v-if="posting !== ''"
            :width="topImageSize.width" :height="topImageSize.height"
            :url="posting.image"></image-bg>
            <div class="black" :style="topImageSize"></div>
          </div>
          <div id="belowTop">
            <div v-if="posting.title !== undefined" id="title_1" class="myeongjo">
              {{divideTitle(posting.title)[0]}}
            </div>
            <div v-if="posting.title !== undefined" id="title_2" class="myeongjo">
              {{divideTitle(posting.title)[1]}}
            </div>
            <div v-if="posting.createdAt !== undefined" id="dateAndEditor" class="myeongjo" :style="dateAndEditorStyle">
              {{posting.createdAt.substring(0, 10).replace(/-/g, '.')}}<br>
              {{posting.editor}} 씀
            </div>
            <div id="content">
              <div v-html="posting.content">
              </div>
            </div>
            <div v-if="state.loggedIn && isFavorite" class="trHv" id="likeBtn"
            :style="likeBtnStyle" @click="toggleFavorite()">
              <img src="../../assets/img/posting_fav_on.png"/> 담아두기 취소
            </div>
            <div v-else class="trHv" id="likeBtn" :style="likeBtnStyle" @click="toggleFavorite()">
              <img src="../../assets/img/posting_fav_off.png"/> 담아두기
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main.js'
import ImageBg from '../Common/ImageBg'
const apiUrl = 'http://13.125.24.19:8002/'
// const imgUrl = 'http://13.125.24.19:8001/storage/'
export default {
  components: {ImageBg},
  props: ['layout', 'state', 'postingOn'],
  name: 'PostingPopup',
  data () {
    return {
      writer: '',
      posting: '',
      isFavorite: false
    }
  },
  methods: {
    downloadPosting () {
      this.$axios.get(apiUrl + 'posting/' + this.postingOn).then((response) => {
        this.writer = response.data.writer
        this.posting = response.data.posting
      })
    },
    checkIsFavorite () {
      this.$axios.post(apiUrl + 'favorite/check', this.$qs.stringify({
        token: this.$cookie.get('token'),
        posting_idx: this.postingOn
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => {
        this.isFavorite = response.data.count > 0
        bus.$emit('updateAccount', response)
      })
    },
    toggleFavorite () {
      if (!this.state.loggedIn) {
        alert('로그인 후 가능합니다.')
        return
      }
      this.$axios.put(apiUrl + 'favorite/toggle', this.$qs.stringify({
        token: this.$cookie.get('token'),
        posting_idx: this.postingOn
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => {
        this.isFavorite = response.data.count > 0
        bus.$emit('updateAccount', response)
      })
    },
    close () {
      bus.$emit('setPopup', ['1', ''])
    },
    // 제목을 가능한 중간에서 나누기
    divideTitle (title) {
      var best = 0
      var minDif = 9999
      for (var i = 0; i < title.length - 1; i++) {
        if (title[i] === ' ') {
          if (Math.abs((title.length - i) - i) < minDif) {
            best = i
            minDif = Math.abs((title.length - i) - i)
          }
        }
      }
      return [title.substring(0, best), title.substring(best, title.length)]
    }
  },
  computed: {
    cw () {
      return parseInt(this.layout.centeredWidth.replace('px', ''))
    },
    topImageSize () {
      return {
        width: this.layout.centeredWidth,
        height: parseInt(this.layout.centeredWidth.replace('px', '')) * 0.3 + 'px'
      }
    },
    likeBtnStyle () {
      return {
        left: this.cw - 264 + 'px'
      }
    },
    dateAndEditorStyle () {
      return {
        right: '320px'
      }
    }
  },
  mounted () {
    this.downloadPosting()
    this.checkIsFavorite()
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/popup/popup_common.scss';
  @import '../../assets/scss/popup/posting.scss';
</style>
