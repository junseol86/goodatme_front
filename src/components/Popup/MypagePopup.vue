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
            <div id="colorLabels">
              <div :style="colorLabelStyle" v-for="(color, idx) in ['R', 'G', 'B']" :key="idx">{{color}}</div>
            </div>
            <div id="colorAdjusts">
              <div :style="colorAdjustStyle" v-for="(color, idx) in ['r', 'g', 'b']" :key="idx">
                <div :style="colorAdjustInnerStyle"
                @mousedown="setAjMoving($event, true)" @mouseup="setAjMoving($event, false)" @mouseleave="setAjMoving($event, false)"
                @mousemove="ajMove($event, idx)"
                >
                  <img :src="`http://13.125.24.19:8001/interface/color_adjust_${color}.png`"/>
                  <img :style="adjHandleStyle(idx)" class="abs handle" src="../../assets/img/color_adjust_handle.png"/>
                  <div class="abs" :style="colorAdjustLabelStyle">
                    {{colors[idx]}}
                  </div>
                </div>
              </div>
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
      colors: [0, 0, 0],
      ajMoving: false
    }
  },
  methods: {
    setAjMoving (e, onOff) {
      this.ajMoving = onOff
    },
    ajMove (e, idx) {
      if (!this.ajMoving) return
      var x = e.layerX - this.adjRadius.r
      var y = Math.max(0.1, this.adjRadius.r - e.layerY)
      var rad = Math.atan(y / -x)
      rad += rad < 0 ? Math.PI : 0
      // var deg = rad * 180 / Math.PI
      this.$set(this.colors, idx, Math.round(rad * 255 / Math.PI))
    },
    adjHandleStyle (idx) {
      var rad = Math.max(0, this.colors[idx] * 180 / 256 * (Math.PI / 180))
      var x = this.adjRadius.r - (this.adjRadius.adjR * Math.cos(rad))
      var y = this.adjRadius.r - (this.adjRadius.adjR * Math.sin(rad))
      var handleSize = this.cw / 1600 * 28
      return {
        width: handleSize + 'px',
        height: handleSize + 'px',
        left: x - (handleSize / 2) + 'px',
        top: y - (handleSize / 2) + 'px'
      }
    }
  },
  computed: {
    cw () {
      return parseInt(this.layout.centeredWidth.replace('px', ''))
    },
    shapeSectionStyle () {
      return {
        padding: `${100 * this.cw / 1600}px ${150 * this.cw / 1600}px`
      }
    },
    shapeStyle () {
      var length = this.cw * 320 / 1600 + 'px'
      var radius = this.cw * 160 / 1600 + 'px'
      return {
        width: length,
        height: length,
        backgroundColor: `rgb(${this.colors[0]},${this.colors[1]},${this.colors[2]})`,
        borderRadius: radius
      }
    },
    shapeDescStyle () {
      return {
        top: this.cw * 0.09 + 'px',
        left: this.cw * 0.35 + 'px',
        fontSize: this.cw / 550 + 'em'
      }
    },
    shapeWB () {
      return (this.colors[0] + this.colors[1] + this.colors[2]) / 3 > 128 ? 'b' : 'w'
    },
    shapeAdj () {
      return this.$consts.shapes[this.state.account.shape][2]
    },
    shapeNick () {
      return this.$consts.shapes[this.state.account.shape][1]
    },
    colorLabelStyle () {
      return {
        fontSize: this.cw / 440 + 'em',
        width: 400 * this.cw / 1600 + 'px',
        marginTop: 64 * this.cw / 1600 + 'px',
        marginBottom: 24 * this.cw / 1600 + 'px'
      }
    },
    // 색상 조정판 크기
    // 실제 조정판: 300 * 150
    // 패딩: 28
    // 선 두깨: 10
    colorAdjustStyle () {
      return {
        width: 400 * this.cw / 1600 + 'px',
        height: 178 * this.cw / 1600 + 'px'
      }
    },
    colorAdjustInnerStyle () {
      return {
        width: 328 * this.cw / 1600 + 'px',
        height: 178 * this.cw / 1600 + 'px',
        marginLeft: 36 * this.cw / 1600 + 'px'
      }
    },
    colorAdjustLabelStyle () {
      return {
        width: 328 * this.cw / 1600 + 'px',
        height: 178 * this.cw / 1600 + 'px',
        lineHeight: 240 * this.cw / 1600 + 'px',
        top: 0,
        fontSize: this.cw / 400 + 'em'
      }
    },
    adjRadius () {
      return {
        // 마우스 반경의 반지름
        r: 164 * this.cw / 1600,
        // 반원 띠의 두께를 고려한 실제 핸들이 움직일 반지름
        adjR: 145 * this.cw / 1600
      }
    }
  },
  mounted () {
    var colorsStrs = this.state.account.color_str.split('-')
    this.$set(this.colors, 0, parseInt(colorsStrs[0]))
    this.$set(this.colors, 1, parseInt(colorsStrs[1]))
    this.$set(this.colors, 2, parseInt(colorsStrs[2]))
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/popup/popup_common.scss';
  @import '../../assets/scss/popup/mypage.scss';
</style>
