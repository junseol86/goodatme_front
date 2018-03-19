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
            <div id="title">
              {{posting.title}}
            </div>
            <div id="content">
              <div v-html="posting.content">
              </div>
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
      posting: ''
    }
  },
  methods: {
    downloadPosting () {
      this.$axios.get(apiUrl + 'posting/' + this.postingOn).then((response) => {
        this.writer = response.data.writer
        this.posting = response.data.posting
      })
    },
    close () {
      bus.$emit('setPopup', ['1', ''])
    }
  },
  computed: {
    topImageSize () {
      return {
        width: this.layout.centeredWidth,
        height: parseInt(this.layout.centeredWidth.replace('px', '')) * 0.3 + 'px'
      }
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
