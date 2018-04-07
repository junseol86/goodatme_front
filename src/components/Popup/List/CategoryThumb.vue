<template>
  <div class="category_thumb" :style="thumbStyle" @click="openPosting(posting.idx)">
    <div :style="{padding: imgPadding + 'px'}">
      <div class="blurCut">
        <image-bg class="imgBg" :width="imgW" :height="imgH" :url="posting.image"></image-bg>
      </div>
      <div :style="blackBgStyle" class="blackBg">
        <div :style="shapeStyle">
          <img
          :src="'http://13.125.24.19:8001/interface/subsc_' + posting.shape + '.png'">
          <br>
        </div>
        <div class="myeongjo" :style="titleStyle">{{util('strLimit', [posting.title, 12])}}</div>
        <div :style="dateSubCtgrStyle">
          {{posting.createdAt.substr(0, 10).replace(/-/g, '.')}}
          <span class="subCategory">
            {{posting.sub_category}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../../main.js'
import ImageBg from '../../Common/ImageBg'
export default {
  components: {ImageBg},
  props: ['lrPadding', 'layout', 'state', 'posting'],
  name: 'CategoryThumb',
  data () {
    return {
      imgPadding: 12
    }
  },
  methods: {
    util (which, args) {
      return this.$util[which](args)
    },
    openPosting (idx) {
      bus.$emit('openPosting', idx)
    }
  },
  computed: {
    cw () {
      return parseInt(this.layout.centeredWidth.replace('px', ''))
    },
    thumbStyle () {
      return {
        width: (this.cw - (2 * this.lrPadding)) / 3 + 'px',
        height: (this.cw - (2 * this.lrPadding)) * 3 / 12 + 'px'
      }
    },
    imgW () {
      return (this.cw - (2 * this.lrPadding)) / 3 - (2 * this.imgPadding) + 'px'
    },
    imgH () {
      return (this.cw - (2 * this.lrPadding)) * 3 / 12 - (2 * this.imgPadding) + 'px'
    },
    blackBgStyle () {
      return {
        top: this.imgPadding + 'px',
        left: this.imgPadding + 'px',
        width: this.imgW,
        height: this.imgH
      }
    },
    shapeStyle () {
      var r = parseInt(this.posting.color_r) * 85 + 60
      var g = parseInt(this.posting.color_g) * 85 + 60
      var b = parseInt(this.posting.color_b) * 85 + 60
      var bg = `rgb(${r}, ${g}, ${b})`
      return {
        width: this.cw / 28 + 'px',
        height: this.cw / 28 + 'px',
        top: this.cw / 80 + 'px',
        right: this.cw / 80 + 'px',
        borderRadius: this.cw / 48 + 'px',
        backgroundColor: bg
      }
    },
    dateSubCtgrStyle () {
      return {
        left: this.cw / 80 + 'px',
        bottom: this.cw / 56 + 'px',
        fontSize: this.cw / 1200 + 'em'
      }
    },
    titleStyle () {
      return {
        left: this.cw / 80 + 'px',
        bottom: this.cw / 22 + 'px',
        fontSize: this.cw / 750 + 'em'
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../assets/scss/popup/popup_common.scss';
  @import '../../../assets/scss/popup/list/category_thumb.scss';
</style>
