<template>
  <div class="about-popup">
    <div class="popup_wrapper" :style="{width: layout.windowWidth, height: layout.windowHeight}">
      <div :style="{width: layout.windowWidth}">
        <div id="board" :style="{width: layout.centeredWidth}">
          <div id="floatTopbar" :style="floatTopbarStyle">
            <div class="trHv" @click="close()">
              <img src="../../assets/img/posting_x.png">
            </div>
          </div>
          <div id="topImage">
            <image-bg-sized
            :width="topImageSize.width"
            :url="'about.png'"></image-bg-sized>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main.js'
import ImageBgSized from '../Common/ImageBgSized'
export default {
  components: {ImageBgSized},
  props: ['layout'],
  name: 'AboutPopup',
  data () {
    return {
    }
  },
  methods: {
    close () {
      bus.$emit('setPopup', ['1', ''])
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
    floatTopbarStyle () {
      return {
        width: this.layout.centeredWidth,
        left: (parseInt(this.layout.windowWidth.replace('px', '')) - this.cw) / 2 + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/popup/popup_common.scss';
  @import '../../assets/scss/popup/posting.scss';
</style>
