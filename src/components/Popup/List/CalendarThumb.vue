<template>
  <div class="calendar_thumb">
    <div v-if="posting.showMonthYear" :style="monthYearStyle">
      {{getMonthName(posting.createdAt.substring(5, 7))}}
      {{posting.createdAt.substring(0, 4)}}
    </div>
    <div v-if="!posting.showMonthYear" :style="thumbStyle" @click="openPosting(posting.idx)">
      <div class="padded">
        <image-bg class="imgBg" :width="imgW" :height="imgH" :url="posting.image"></image-bg>
        <div class="ctgr_subCtgr">
          _{{posting.category}} <span>{{posting.sub_category}}</span>
        </div>
        <div class="myeongjo" :style="titleStyle">
          {{posting.title}}
        </div>
        <div :style="briefStyle">
          {{util('strLimit', [posting.brief, 60])}}
        </div>
        <div :style="dateStyle">
          {{posting.createdAt.slice(8, 10)}}
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
  props: ['lrPadding', 'layout', 'state', 'posting', 'idx'],
  name: 'CalendarThumb',
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
    },
    getMonthName (code) {
      return this.$consts.monthNames[code]
    }
  },
  computed: {
    cw () {
      return parseInt(this.layout.centeredWidth.replace('px', ''))
    },
    imgW () {
      return (this.cw - (2 * this.lrPadding)) / 4 - (2 * this.imgPadding) + 'px'
    },
    imgH () {
      return (this.cw - (2 * this.lrPadding)) / 4 * (3 / 5) - (2 * this.imgPadding) + 'px'
    },
    monthYearStyle () {
      return {
        width: this.cw - (2 * this.lrPadding) + 'px',
        paddingLeft: this.imgPadding + 'px',
        fontSize: this.cw / 320 + 'em',
        marginTop: '48px'
      }
    },
    thumbStyle () {
      return {
        width: (this.cw - (2 * this.lrPadding)) / 4 + 'px',
        padding: `0 0 ${this.imgPadding}px ${this.imgPadding}px`,
        marginBottom: this.imgPadding * 3 + 'px',
        borderRight: '1px solid #333'
      }
    },
    titleStyle () {
      return {
        fontSize: this.cw / 960 + 'em',
        padding: `${this.cw / 72}px 0`
      }
    },
    briefStyle () {
      return {
        width: (this.cw - (2 * this.lrPadding)) / 4 - (2 * this.imgPadding) + 'px',
        height: this.cw / 18 + 'px'
      }
    },
    dateStyle () {
      return {
        fontSize: this.cw / 500 + 'em'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../assets/scss/popup/popup_common.scss';
  @import '../../../assets/scss/popup/list/calendar_thumb.scss';
</style>
