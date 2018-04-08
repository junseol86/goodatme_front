<template>
  <div class="posting-popup">
    <div class="popup_wrapper" :style="{width: layout.windowWidth, height: layout.windowHeight}">
      <div :style="{width: layout.windowWidth}">
        <div id="board" :style="{width: layout.centeredWidth}">
          <div id="floatTopbar" :style="floatTopbarStyle">
            <div class="trHv" @click="close()">
              <img src="../../assets/img/posting_x.png">
            </div>
            <div class="trHv" @click="toggleFavorite()">
              <img v-if="state.loggedIn && isFavorite" src="../../assets/img/posting_fav_on.png"/>
              <img v-else src="../../assets/img/posting_fav_off.png"/>
            </div>
          </div>
          <!-- <img class="trHv"
          :style="{right: layout.closeRight}" id="close" src="../../assets/img/popup_x_72.png" @click="close()"/> -->
          <div id="topImage">
            <image-bg-sized v-if="posting !== ''"
            :width="topImageSize.width"
            :url="posting.image"></image-bg-sized>
            <!-- <div class="black" :style="topImageSize"></div> -->
          </div>
          <div id="belowTop">
            <div v-if="posting.title !== undefined" id="title_1" class="myeongjo">
              {{divideTitle(posting.title)[0]}}
            </div>
            <div v-if="posting.title !== undefined" id="title_2" class="myeongjo">
              {{divideTitle(posting.title)[1]}}
            </div>
            <div v-if="posting.createdAt !== undefined" id="dateAndEditor" class="myeongjo">
              {{posting.createdAt.substring(0, 10).replace(/-/g, '.')}}<br>
              {{posting.editor}} 씀
            </div>
            <div id="hashtags">
              <span v-if="posting.hashtags !== undefined" v-for="(hashtag, idx) in hashtags"
              :key="idx" @click="searchHashtag(hashtag)">
                #{{hashtag}}
              </span>
            </div>
            <div id="content">
              <div v-html="posting.content">
              </div>
            </div>
          </div>
          <div v-if="state.loggedIn" class="inputCon">
            <textarea placeholder="댓글" v-model="commenting"/>
            <div @click="uploadComment()">
              올리기
            </div>
          </div>
          <div class="comments">
            <table v-for="(comment, idx) in comments" :key="idx">
              <tbody>
                <tr>
                  <td :class="comment.mine ? 'mine' : ''" width="112">
                    {{comment.user_nickname}}
                    <div class="date">{{comment.createdAt.substring(0, 10).replace(/-/g, '.')}}</div>
                  </td>
                  <td>
                    <span class="myeongjo">
                      {{comment.content}}
                    </span>
                  </td>
                  <td v-if="comment.mine" width="12px">
                  </td>
                  <td v-if="comment.mine" class="trHv" width="48px" @click="deleteComment(comment.idx)">
                    | 삭제
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="forAdmin" v-if="state.account.type === 'ADMIN'">
            <span class="trHv" @click="deletePosting()">[Delete]</span>
            <span> | </span>
            <span class="trHv" @click="modifyPosting()">[Modify]</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main.js'
import ImageBgSized from '../Common/ImageBgSized'
const apiUrl = 'http://13.125.24.19:8002/'
// const imgUrl = 'http://13.125.24.19:8001/storage/'
export default {
  components: {ImageBgSized},
  props: ['layout', 'state', 'postingOn'],
  name: 'PostingPopup',
  data () {
    return {
      writer: '',
      posting: '',
      commenting: '',
      isFavorite: false,
      comments: []
    }
  },
  methods: {
    // 먼저 포스팅을 다운로드하고
    downloadPosting () {
      this.$axios.get(apiUrl + 'posting/' + this.postingOn).then((response) => {
        this.writer = response.data.writer
        this.posting = response.data.posting
        this.getComments(true)
      })
    },
    // 댓글들을 불러온 뒤
    getComments (checkFav) {
      var arg = {
        posting_idx: this.postingOn
      }
      if (this.state.loggedIn) {
        arg.token = this.$cookie.get('token')
      }
      this.$axios.post(apiUrl + 'comment/list', this.$qs.stringify(arg), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => {
        bus.$emit('updateAccount', response)
        this.comments = response.data.comments
        if (checkFav && this.state.loggedIn) {
          this.checkIsFavorite()
        }
      })
    },
    // 내가 담아둔 포스팅인가 여부 판단
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
    uploadComment () {
      if (this.commenting.trim().length > 0) {
        this.$axios.post(apiUrl + 'comment/write', this.$qs.stringify({
          token: this.$cookie.get('token'),
          posting_idx: this.postingOn,
          content: this.commenting
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          bus.$emit('updateAccount', response)
          this.comments = response.data.comments
          this.commenting = ''
        })
      }
    },
    deleteComment (idx) {
      if (confirm('이 댓글을 삭제하시겠습니까?')) {
        this.$axios.post(apiUrl + 'comment/delete', this.$qs.stringify({
          token: this.$cookie.get('token'),
          posting_idx: this.postingOn,
          comment_idx: idx.toString()
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          bus.$emit('updateAccount', response)
          this.comments = response.data.comments
        })
      }
    },
    deletePosting () {
      if (confirm('이 게시물을 삭제하시겠습니까?')) {
        this.$axios.post(apiUrl + 'posting/delete', this.$qs.stringify({
          token: this.$cookie.get('token'),
          posting_idx: this.postingOn
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          bus.$emit('updateAccount', response)
          alert('포스팅이 삭제되었습니다.')
          window.location.reload()
        })
      }
    },
    modifyPosting () {
      bus.$emit('setPopup', ['1', '_' + this.postingOn])
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
    searchHashtag (hashtag) {
      this.close()
      bus.$emit('setPopup', ['0', `search#${hashtag}`])
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
    floatTopbarStyle () {
      return {
        width: this.layout.centeredWidth,
        left: (parseInt(this.layout.windowWidth.replace('px', '')) - this.cw) / 2 + 'px'
      }
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
    hashtags () {
      return this.posting.hashtags === undefined ? [] : this.posting.hashtags.split(',')
    }
  },
  mounted () {
    this.downloadPosting()
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/popup/popup_common.scss';
  @import '../../assets/scss/popup/posting.scss';
</style>
