<template>
  <div class="dashboard">
    <div id="dashboard_wrapper" :class="popup === '' ? '' : 'noScroll'"
    :style="{width: layout.windowWidth, height: layout.windowHeight}">
      <!-- 상단바 -->
      <div id="topbar" :style="{width: layout.windowWidth}">
        <div class="centered" :style="{width: layout.centeredWidth}">
          <div id="topbar-left">
            <img class="trHv" src="../../assets/img/topbar_menu.png">
              지오오디_에이티.엠이
          </div>
          <div id="topbar-right">
            <span v-if="!state.loggedIn">
              <span class="trHv" id="login-btn" @click="setPopup('login')">
                Login
              </span>
              |
              <span class="trHv" id="login-btn">
                Register
              </span>
            </span>
            <span v-else>
              <span class="trHv" id="mypage-btn" @click="setPopup('mypage')">
                Mypage
              </span>
              <span v-if="state.account.type == 'ADMIN'" class="trHv" id="write-post-btn" @click="beginWrite()">
                Post
              </span>
              |
              <span class="trHv" id="logout-btn" @click="logout(true)">
                Logout
              </span>
            </span>
            <img class="trHv" src="../../assets/img/topbar_search.png">
          </div>
        </div>
      </div>

      <!-- 컨텐츠 -->
      <div id="contents">
        <!-- 최상단 슬라이드 -->
        <div id="top-slide" class="centered" :style="{width: layout.centeredWidth, height: layout.topSlideH}">
          <div v-if="content.topSlide.list.length> 0" class="black-bg-text"
            :style="{width: layout.centeredWidth, height: layout.topSlideH}">
            <image-bg :width="layout.centeredWidth" :height="layout.topSlideH"
            :url="'2018-2-4_2-43-52-6907.jpg'"></image-bg>
            <div class="abs darkBg" :style="{width: layout.centeredWidth, height: layout.topSlideH}"></div>
            <div class="abs ctgr" :style="placeInsideTopSlide('ctgr')">
              _{{content.topSlide.list[content.topSlide.selectedIdx].ctgr}}
            </div>
            <div class="abs title" :style="placeInsideTopSlide('title')">
              <img :style="placeInsideTopSlide('img')"
              :src="'http://13.125.24.19:8001/interface/outline_' + content.topSlide.list[content.topSlide.selectedIdx].shape + '.png'">
              <br>{{content.topSlide.list[content.topSlide.selectedIdx].title}}
            </div>
            <div class="abs subCtgr" :style="placeInsideTopSlide('subCtgr')">
              {{content.topSlide.list[content.topSlide.selectedIdx].subCtgr}}
            </div>
            <div class="abs date-editor" :style="placeInsideTopSlide('date-editor')">
              {{content.topSlide.list[content.topSlide.selectedIdx].date}}<br>
              <span>by</span>
              {{content.topSlide.list[content.topSlide.selectedIdx].editor}} 에디터
            </div>
          </div>
        </div>

        <!-- 나의 라이프스타일 띠 -->
        <div id="intro-stripe" :style="introStripeStyle">
          <div id="shape-pattern" :style="shapePatternStyle">
          </div>
          <div class="message" v-if="!state.loggedIn" :style="{width: layout.windowWidth}">
            나를 위한 공간을 찾아보세요.<br>
            <span class="trHv">회원가입</span> | <span class="trHv" @click="setPopup('login')">로그인</span>
          </div>
          <div class="message" v-else :style="{width: layout.windowWidth}">
            {{shapeAdj}}<br>
            {{shapeNick}} {{state.account.nickname + '님만을 위한 공간'}}
          </div>
        </div>

        <!-- 달력 -->
        <div id="calendar">
          <div class="centered" :style="{width: layout.centeredWidth}">
            <div class="year">
              Jan 2018
            </div>
            <div class="more">
              <span class="gray-btn trHv">전체보기</span>
            </div>
            <div class="list">
              <div v-for="posting in content.calendar.list" :key="posting.idx" @click="openPosting(posting.idx)">
                <div>
                  <div class="imgBgCon">
                    <image-bg :url="posting.image"
                    :width="content.calendar.imgWidth" :height="content.calendar.imgHeight"></image-bg>
                  </div>
                  <!-- <div class="img" :style="{height: content.calendar.imgHeight}"
                  v-bind:data-url="posting.image" @load="fillBg('hoho')"></div> -->
                  <div class="category">
                    <span class="ctgr">_{{posting.category}}</span>
                    <span class="subCtgr">{{posting.sub_category}}</span>
                  </div>
                  <div class="title myeongjo" :style="{fontSize: content.calendar.fontSize}">
                    {{util('strLimit', [posting.title, 12])}}
                  </div>
                  <div class="brief" :style="{height: content.calendar.briefHeight}">
                    {{util('strLimit', [posting.brief, 60])}}
                  </div>
                  <div class="date">{{posting.createdAt.slice(5, 7)}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 나의 라이프스타일은 -->
        <div id="my-lifestyle">
          <div class="stripe" :style="{width: layout.windowWidth}">
            <div class="pattern" :style="{width: layout.windowWidth}">
            </div>
            <div class="message" :style="{width: layout.windowWidth}">
              {{myLifestyleMessage}}
            </div>
          </div>
          <div class="edit centered" :style="{width: layout.centeredWidth}">
            <span class="gray-btn trHv">편집하기</span>
          </div>
          <div class="subscribings centered" :style="{width: layout.centeredWidth}">
            <div v-for="(subs, idx) in content.lifestyle.subscribings" :key="idx" class="trHv" :style="codeToColor(subs.color)">
              <img :src="'http://13.125.24.19:8001/interface/subsc_' + subs.shape + '.png'">
            </div>
          </div>
        </div>

        <!-- 포스팅들 -->
        <div v-for="category in categories" :key="category" class="postings centered" :style="{width: layout.centeredWidth}">
          <table>
            <tr>
              <td width="80">_{{category}}</td>
              <td class="underline"></td>
              <td width="88">
                <span class="gray-btn trHv">전체보기</span>
              </td>
            </tr>
          </table>
          <div class="canvas" :style="{height: content.postings.canvasHeight}">
            <div v-for="(posting, idx) in content.postings[category].list"
            :key="posting.idx" :class="['posting', category]" :style="placePosting(category, idx, false)">
              <image-bg
              :width="placePosting(category, idx, true).width"
              :height="placePosting(category, idx, true).height"
              :url="posting.image">
              </image-bg>
              <div class="abs black-cover" :style="placePosting(category, idx, true)">
              </div>
              <span class="abs title" :style="placeInsidePosting('title')">{{posting.title}}</span>
              <span class="abs subCtgr" :style="placeInsidePosting('subCtgr')">{{posting.subCtgr}}</span>
              <span class="abs date" :style="placeInsidePosting('date')">{{posting.date}}</span>
              <div class="abs symbol" :style="placeInsidePosting('symbol')">
                <div :style="codeToColor(posting.color)">
                  <img :src="'http://13.125.24.19:8001/interface/subsc_' + posting.shape + '.png'">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 샵 -->
        <div id="shop" class="centered" :style="{width: layout.centeredWidth}">
          <span class="label">_shop</span>
        </div>

      </div>
      <div class="popup">
        <login-popup v-if="popup == 'login'" :layout="layout" :state="state"></login-popup>
        <mypage-popup v-if="popup == 'mypage' && state.loggedIn" :layout="layout" :state="state"></mypage-popup>
        <write-popup v-if="popup == 'write'" :layout="layout" :state="state"></write-popup>
        <posting-popup v-if="popup == 'posting'" :layout="layout" :state="state" :postingOn="postingOn"></posting-popup>
      </div>
      <div class="popup2">
        <question-popup v-if="popup2 == 'question'" :layout="layout" :state="state"></question-popup>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main.js'
import ImageBg from '../Common/ImageBg'
import LoginPopup from '../Popup/LoginPopup'
import QuestionPopup from '../Popup/QuestionPopup'
import MypagePopup from '../Popup/MypagePopup'
import WritePopup from '../Popup/WritePopup'
import PostingPopup from '../Popup/PostingPopup'
const apiUrl = 'http://13.125.24.19:8002/'
export default {
  components: {ImageBg, LoginPopup, MypagePopup, WritePopup, PostingPopup, QuestionPopup},
  name: 'Dashboard',
  data () {
    return {
      categories: ['eat', 'play', 'work'],
      layout: {
        windowWidth: '',
        windowHeight: '',
        centeredWidth: '',
        topSlideH: ''
      },
      state: {
        loggedIn: false,
        account: {
          email: '',
          nickname: '',
          shape: '',
          color_r: '',
          color_g: '',
          color_b: '',
          color_str: '',
          type: ''
        }
      },
      popup: '',
      popup2: '',
      postingOn: '',
      content: {
        topSlide: {
          selectedIdx: 0,
          list: []
        },
        calendar: {
          page: 0,
          list: [],
          imgHeight: '',
          fontSize: '',
          briefHeight: ''
        },
        lifestyle: {
          subscribings: []
        },
        postings: {
          eat: {
            order: [],
            list: []
          },
          play: {
            order: [],
            list: []
          },
          work: {
            order: [],
            list: []
          }
        }
      }
    }
  },
  methods: {
    util (which, args) {
      return this.$util[which](args)
    },
    centerWCanvasH () {
      let centerW = Math.max(Math.min(window.innerWidth - 50, 1600), 1080)
      return [centerW, centerW / 2]
    },
    // 화면 요소들 사이즈
    setSizes () {
      let winW = window.innerWidth
      let cntrW = this.centerWCanvasH()[0]
      this.layout.windowWidth = winW + 'px'
      this.layout.windowHeight = window.innerHeight + 'px'
      this.layout.centeredWidth = cntrW + 'px'
      this.layout.topSlideH = cntrW * 0.4 + 'px'
      this.content.calendar.imgWidth = cntrW / 5 - 24 + 'px'
      this.content.calendar.imgHeight = cntrW * 0.1 + 'px'
      this.content.calendar.fontSize = cntrW / 920 + 'em'
      this.content.calendar.briefHeight = cntrW * 0.08 + 'px'
      this.content.postings.canvasHeight = this.centerWCanvasH()[1] + 'px'
      bus.$emit('setBg')
    },
    fillBg (el) {
      console.log('HH')
      console.log(el)
    },
    setPopup (which) {
      this.popup = which
    },
    setPopup2 (which) {
      this.popup2 = which
    },
    codeToColor (code) {
      let offset = 60
      let r = parseInt(code.split('-')[0]) * 85 + offset
      let g = parseInt(code.split('-')[1]) * 85 + offset
      let b = parseInt(code.split('-')[2]) * 85 + offset
      let result = {
        backgroundColor: `rgb(${r}, ${g}, ${b})`
      }
      return result
    },
    placeInsideTopSlide (which) {
      let cntrW = this.centerWCanvasH()[0]
      var style = {}
      switch (which) {
        case 'title': {
          style.left = cntrW / 5 + 'px'
          style.bottom = cntrW / 11 + 'px'
          style.width = cntrW * 0.25 + 'px'
          style.fontSize = cntrW / 500 + 'em'
          break
        }
        case 'img': {
          style.width = cntrW / 15 + 'px'
          style.hight = cntrW / 15 + 'px'
          break
        }
        case 'ctgr': {
          style.left = cntrW / 5 + 'px'
          style.top = cntrW / 24 + 'px'
          style.fontSize = cntrW / 300 + 'em'
          break
        }
        case 'subCtgr': {
          style.left = cntrW / 5 + 'px'
          style.bottom = cntrW / 16 + 'px'
          break
        }
        case 'date-editor': {
          style.right = cntrW * 0.58 + 'px'
          style.bottom = cntrW / 16 - 16 + 'px'
          break
        }
      }
      return style
    },
    placePosting (ctgr, idx, sizeOnly) {
      let style = {
        width: 0,
        height: 0,
        top: '',
        left: ''
      }
      let cntrW = this.centerWCanvasH()[0]
      let padding = 20
      let width = (cntrW - (2 * padding)) / 3
      let canvasH = this.centerWCanvasH()[1]
      let doubleH = (canvasH - padding) / 2
      let tripleH = (canvasH - (2 * padding)) / 3
      let tops = [0, 0, doubleH + padding, 0, tripleH + padding, (tripleH + padding) * 2]
      let heights = [canvasH, doubleH, doubleH, tripleH, tripleH, tripleH]
      let hPos = [0, 1, 1, 2, 2, 2]
      if (!sizeOnly) {
        style.left = this.content.postings[ctgr].order[hPos[idx]] * (width + padding) + 'px'
        style.top = tops[idx] + 'px'
      }
      style.width = width + 'px'
      style.height = heights[idx] + 'px'
      return style
    },
    placeInsidePosting (which) {
      let cntrW = this.centerWCanvasH()[0]
      var style = {}
      switch (which) {
        case 'title': {
          style.left = cntrW / 50 + 'px'
          style.bottom = cntrW / 20 + 'px'
          style.width = cntrW / 4 + 'px'
          style.fontSize = cntrW / 680 + 'em'
          break
        }
        case 'date': {
          style.left = cntrW / 50 + 'px'
          style.bottom = cntrW / 40 + 'px'
          break
        }
        case 'subCtgr': {
          style.left = cntrW / 50 + 112 + 'px'
          style.bottom = cntrW / 40 - 4 + 'px'
          break
        }
        case 'symbol': {
          style.top = cntrW / 52 + 'px'
          style.right = cntrW / 52 + 'px'
          break
        }
      }
      return style
    },
    // 이메일과 비밀번호로 로그인
    login (email, password) {
      this.$axios.get(apiUrl + 'account/login', {
        headers: {
          'email': email,
          'password': password
        }
      }).then((response) => {
        this.updateAccount(response)
        this.popup = ''
      }).catch((error) => {
        alert(error.response.data)
      })
    },
    // 토큰으로 로그인
    access () {
      if (this.$cookie.get('token') === undefined) {
        this.logout(false)
      } else {
        this.$axios.get(apiUrl + 'account/access', {
          headers: {
            'token': this.$cookie.get('token')
          }
        }).then((response) => {
          this.updateAccount(response)
          this.popup = ''
        }).catch((error) => {
          alert(error.response.data)
          this.logout(true)
        })
      }
    },
    // 로그인 등 계정을 필요로 하는 작업 후 토큰 등 계정정보 업데이트
    updateAccount (response) {
      this.state.account = response.data.account
      this.state.loggedIn = true
      this.$cookie.set('token', response.data.token, 7)
    },
    // 로그아웃
    logout (reload) {
      this.$cookie.remove('token')
      this.state.loggedIn = false
      Object.keys(this.state.account).map((it) => {
        this.state.account[it] = ''
      })
    },
    // 게시물 작성 팝업을 열고 에디터 초기화
    beginWrite () {
      this.setPopup('write')
      bus.$emit('initEditor', false)
    },
    setMock () {
      let mock = require('../../assets/js/mock.js')
      this.content.topSlide.list = mock.topSlides
      this.content.calendar.list = mock.calendar_5

      this.content.lifestyle.subscribings = mock.subscribings

      let _this = this
      this.categories.forEach(function (ctgr) {
        _this.content.postings[ctgr].list = window._.shuffle(mock.posting_6)
      })
    },
    getPostings () {
      this.$axios.get(apiUrl + 'posting/posting')
        .then((response) => {
          this.content.calendar.list = response.data
        })
    },
    openPosting (idx) {
      this.postingOn = idx
      this.setPopup('posting')
    },
    afterPostingUpload () {
      this.popup = ''
      this.getPostings()
    }
  },
  computed: {
    myLifestyleMessage: function () {
      return this.state.loggedIn ? `${this.state.account.nickname}님께서 구독중이신 라이프스타일` : '구독할 라이프스타일을 선택하세요.'
    },
    shapeAdj () {
      return this.$consts.shapes[this.state.account.shape][2]
    },
    shapeNick () {
      return this.$consts.shapes[this.state.account.shape][1]
    },
    myShape: function () {
      return this.state.loggedIn ? this.state.account.shape : 'random'
    },
    myColor: function () {
      return this.state.loggedIn
        ? `rgb(${this.state.account.color_str.split('-')[0]},
        ${this.state.account.color_str.split('-')[1]},
        ${this.state.account.color_str.split('-')[2]})`
        : 'tomato'
    },
    shapeWB () {
      var colors = this.state.loggedIn ? this.state.account.color_str.split('-') : [0, 0, 0]
      return (parseInt(colors[0]) + parseInt(colors[1]) + parseInt(colors[2])) / 3 > 128 ? 'b' : 'w'
    },
    introStripeStyle: function () {
      return {
        width: this.layout.windowWidth,
        backgroundColor: this.myColor,
        color: this.shapeWB === 'w' ? 'white' : 'black'
      }
    },
    shapePatternStyle: function () {
      return {
        width: this.layout.windowWidth,
        backgroundImage: `url("http://13.125.24.19:8001/interface/shape_pattern_${this.myShape}_${this.shapeWB}.png")`

      }
    }
  },
  mounted () {
    this.setSizes()
    let setSizes = this.setSizes
    window.addEventListener('resize', function () {
      setSizes()
    })
    this.setMock()

    bus.$on('setPopup', which => {
      this.setPopup(which)
    })
    bus.$on('setPopup2', which => {
      this.setPopup2(which)
    })
    bus.$on('login', emPw => {
      this.login(emPw[0], emPw[1])
    })
    bus.$on('updateAccount', response => {
      this.updateAccount(response)
    })
    bus.$on('afterPostingUpload', () => {
      this.afterPostingUpload()
    })

    // 토큰 로그인 시도
    this.access()
    // 대시보드의 컨텐츠 다운로드
    this.getPostings()
  },
  created () {
    let _this = this
    // 카테고리마다의 리스트에서 타일 크기마다의 열 배열 순서를 처음에 무작위 순서로
    this.categories.forEach(function (ctgr) {
      _this.content.postings[ctgr].order = window._.shuffle([0, 1, 2])
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/common/topbar.scss';
  @import '../../assets/scss/dashboard/dashboard.scss';
  @import '../../assets/scss/dashboard/top_slide.scss';
  @import '../../assets/scss/dashboard/intro_stripe.scss';
  @import '../../assets/scss/dashboard/calendar.scss';
  @import '../../assets/scss/dashboard/my_lifestyle.scss';
  @import '../../assets/scss/dashboard/postings.scss';
  @import '../../assets/scss/dashboard/shop.scss';
</style>
