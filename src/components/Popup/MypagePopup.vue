<template>
  <div class="mypage-popup">
    <div class="popup_wrapper" :style="{width: layout.windowWidth, height: layout.windowHeight}">
      <div :style="{width: layout.windowWidth}">
        <div id="mypage" :style="{width: layout.centeredWidth}">
          <div id="shapeSection" :style="shapeSectionStyle">
            <div id="shape" :style="shapeStyle">
              <img :src="`http://13.125.24.19:8001/interface/shp_lg_strk_${shapeWB}_${state.account.shape}.png`">
            </div>
            <div id="shapeDesc" :style="shapeDescStyle">
              <span>{{state.account.nickname}}님은</span><br>
              {{shapeAdj}}<br>
              {{shapeNick}}<br>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import {bus} from '../../main.js'
export default {
  props: ['layout', 'state'],
  name: 'MypagePopup',
  data () {
    return {
    }
  },
  computed: {
    shapeSectionStyle () {
      var cw = parseInt(this.layout.centeredWidth.replace('px', ''))
      return {
        padding: `${100 * cw / 1600}px ${150 * cw / 1600}px`
      }
    },
    shapeStyle () {
      var cw = parseInt(this.layout.centeredWidth.replace('px', ''))
      var length = cw * 320 / 1600 + 'px'
      var radius = cw * 160 / 1600 + 'px'
      var colorStr = this.state.account.color_str.split('-')
      return {
        width: length,
        height: length,
        backgroundColor: `rgb(${colorStr[0]},${colorStr[1]},${colorStr[2]})`,
        borderRadius: radius
      }
    },
    shapeDescStyle () {
      var cw = parseInt(this.layout.centeredWidth.replace('px', ''))
      return {
        top: cw * 0.09 + 'px',
        left: cw * 0.35 + 'px',
        fontSize: cw / 550 + 'em'
      }
    },
    shapeWB () {
      var colorStr = this.state.account.color_str.split('-')
      return ((parseInt(colorStr[0])) + parseInt(colorStr[1]) + parseInt(colorStr[2])) / 3 > 128 ? 'b' : 'w'
    },
    shapeAdj () {
      return this.$consts.shapes[this.state.account.shape][2]
    },
    shapeNick () {
      return this.$consts.shapes[this.state.account.shape][1]
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/popup/popup_common.scss';
  @import '../../assets/scss/popup/mypage.scss';
</style>
