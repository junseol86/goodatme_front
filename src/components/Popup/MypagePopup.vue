<template>
  <div class="mypage-popup">
    <div class="popup_wrapper" :style="{width: layout.windowWidth, height: layout.windowHeight}">
      <div :style="{width: layout.windowWidth}">
        <div id="mypage" :style="{width: layout.centeredWidth}">
          <div id="shapeSection" :style="shapeSectionStyle">
            <div id="shape" :style="shapeStyle" @click="setPopup('2', 'question')">
              <img :src="`http://13.125.24.19:8001/interface/shp_lg_strk_${shapeWB}_${myShape}.png`">
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
                <div class="adjustLabels">
                  <div :style="labelLeftStyle">{{['차분', '양', '즉흥'][idx]}}</div>
                  <div :style="labelRightStyle">{{['활동', '질', '계획'][idx]}}</div>
                </div>
                <div :style="colorResultStyle">
                  #{{colorResult(idx)}}
                </div>
              </div>
            </div>
            <div :style="{fontSize: cw/ 36 + 'px', paddingTop: cw / 16 + 'px'}">구독하는 라이프스타일</div>
            <div class="subscription" :style="{paddingTop: cw / 24 + 'px'}">
              <div v-for="(shape, idx) in Object.keys($consts.shapes)" :key="idx"
              v-if="idx < 9 && shape !== state.account.shape"
              class="trHv" @click="toggleSubscShape(shape)">
                <table>
                  <tr>
                    <td :style="subscShapeStyle(shape, idx)">
                      <img
                      :style="{opacity: state.account.shape_sbsc.split(',').includes(shape) ? 0.67 : 0.1}"
                      :src="'http://13.125.24.19:8001/interface/subsc_' + shape + '.png'">
                    </td>
                    <td :style="{fontSize: cw / 92 + 'px'}">
                      {{$consts.shapes[shape][2]}}<br>
                      <span>{{$consts.shapes[shape][1]}}</span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div :style="{fontSize: cw/ 36 + 'px', paddingTop: cw / 16 + 'px'}">담아둔 장소</div>
          <div class="list" :style="{padding: lrPadding / 2 + 'px ' +  lrPadding + 'px'}">
            <category-thumb v-for="(posting, idx) in favoriteList" :key="idx"
            :lrPadding="lrPadding" :state="state" :layout="layout" :posting="posting"></category-thumb>
          </div>
          <div @click="goToFavorite()" class="trHv"
          :style="{
            fontSize: cw/ 56 + 'px',
            paddingTop: cw / 480 + 'px',
            paddingBottom: cw / 24 + 'px'
            }">
          [ + 모두 보기 ]
          </div>
          <img class="trHv"
          :style="{right: layout.closeRight}" id="close" src="../../assets/img/popup_x_72.png" @click="setPopup('1', '')"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main.js'
import CategoryThumb from '../Popup/List/CategoryThumb'
const apiUrl = 'http://13.125.24.19:8002/'
export default {
  components: {CategoryThumb},
  props: ['layout', 'state'],
  name: 'MypagePopup',
  data () {
    return {
      colors: [0, 0, 0],
      subscColors: this.$util.randomSubscColors(),
      ajMoving: false,
      shouldUpload: false,
      favoriteList: [],
      lrPadding: 64
    }
  },
  methods: {
    setPopup (layer, which) {
      bus.$emit('setPopup', [layer, which])
    },
    // 색 조정 후 서버로 전송
    setAjMoving (e, onOff) {
      this.ajMoving = onOff
      if (!onOff && this.shouldUpload) {
        var toPost = this.$qs.stringify({
          token: this.$cookie.get('token'),
          color_str: `${this.colors[0]}-${this.colors[1]}-${this.colors[2]}`,
          color_r: Math.floor(this.colors[0] / 85),
          color_g: Math.floor(this.colors[1] / 85),
          color_b: Math.floor(this.colors[2] / 85)
        })
        this.$axios.put(apiUrl + 'account/color', toPost, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
          .then((response) => {
            bus.$emit('updateAccount', response)
            this.shouldUpload = false
          }).catch(err => {
            console.log(err)
          })
      }
    },
    ajMove (e, idx) {
      if (!this.ajMoving) return
      var x = e.layerX - this.adjRadius.r
      var y = Math.max(0.1, this.adjRadius.r - e.layerY)
      var rad = Math.atan(y / -x)
      rad += rad < 0 ? Math.PI : 0
      // var deg = rad * 180 / Math.PI
      this.$set(this.colors, idx, Math.round(rad * 255 / Math.PI))
      this.shouldUpload = true
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
    },
    colorResult (idx) {
      var lr = this.colors[idx] < 128 ? 0 : 1
      return [['정적', '활동적'], ['양적', '합리적'], ['즉흥적', '계획적']][idx][lr]
    },
    subscShapeStyle (shape, idx) {
      var subscs = this.state.account.shape_sbsc.split(',')
      return {
        width: this.cw / 20 + 'px',
        height: this.cw / 20 + 'px',
        borderRadius: this.cw / 40 + 'px',
        backgroundColor: subscs.includes(shape) ? this.subscColors[idx] : '#eee'
      }
    },
    toggleSubscShape (shape) {
      var hasOne = this.state.account.shape_sbsc.split(',').includes(shape)
      var newSubsc = []
      this.state.account.shape_sbsc.split(',').map((it) => {
        if (it.length > 0 && it !== shape && it !== this.state.account.shape) {
          newSubsc.push(it)
        }
      })
      if (!hasOne) {
        newSubsc.push(shape)
      }
      var result = ''
      newSubsc.map((it) => {
        result += (it + ',')
      })
      var toPost = this.$qs.stringify({
        token: this.$cookie.get('token'),
        shape_sbsc: result
      })
      this.$axios.put(apiUrl + 'account/sbsc', toPost, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then((response) => {
          bus.$emit('updateAccount', response)
          this.shouldUpload = false
        }).catch(err => {
          console.log(err)
        })
    },
    getFavoriteList () {
      var cond = {
        token: this.$cookie.get('token'),
        limit: 6,
        offset: 0
      }
      this.$axios.post(apiUrl + 'favorite/list', this.$qs.stringify(cond), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => {
        response.data.favorites.map((it) => {
          this.favoriteList = this.favoriteList.concat(it.postings)
        })
        bus.$emit('updateAccount', response)
      })
    },
    goToFavorite () {
      this.setPopup('0', 'favorite')
      this.setPopup('1', '')
    }
  },
  computed: {
    cw () {
      return parseInt(this.layout.centeredWidth.replace('px', ''))
    },
    shapeSectionStyle () {
      return {
        padding: `${100 * this.cw / 1600}px ${150 * this.cw / 1600}px ${10 * this.cw / 1600}px ${150 * this.cw / 1600}px`
      }
    },
    shapeStyle () {
      var length = this.cw * 320 / 1600 + 'px'
      var radius = this.cw * 160 / 1600 + 'px'
      return {
        width: length,
        height: length,
        backgroundColor: `rgb(${this.colors[0]},${this.colors[1]},${this.colors[2]})`,
        borderRadius: radius,
        cursor: 'pointer'
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
    myShape: function () {
      return this.state.loggedIn && this.state.account.shape != null ? this.state.account.shape : 'random'
    },
    shapeAdj () {
      return this.$consts.shapes[this.myShape][2]
    },
    shapeNick () {
      return this.$consts.shapes[this.myShape][1]
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
        width: 400 * this.cw / 1600 + 'px'
        // height: 178 * this.cw / 1600 + 'px'
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
    },
    labelLeftStyle () {
      return {
        float: 'left',
        width: 110 * this.cw / 1600 + 'px',
        fontSize: this.cw / 1200 + 'em'
      }
    },
    labelRightStyle () {
      return {
        float: 'right',
        width: 110 * this.cw / 1600 + 'px',
        fontSize: this.cw / 1200 + 'em'
      }
    },
    colorResultStyle () {
      return {
        fontSize: this.cw / 700 + 'em',
        marginTop: this.cw / 50 + 'px'
      }
    }
  },
  mounted () {
    var colorsStrs = this.state.account.color_str.split('-')
    this.$set(this.colors, 0, parseInt(colorsStrs[0]))
    this.$set(this.colors, 1, parseInt(colorsStrs[1]))
    this.$set(this.colors, 2, parseInt(colorsStrs[2]))
    this.getFavoriteList()
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/popup/popup_common.scss';
  @import '../../assets/scss/popup/mypage.scss';
</style>
