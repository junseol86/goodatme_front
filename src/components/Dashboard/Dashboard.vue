<template>
  <div class="dashboard">
    <div id="dashboard_wrapper" :class="popup_1 === '' ? '' : 'noScroll'"
    :style="{width: layout.windowWidth, height: layout.windowHeight}">
      <!-- 상단바 -->
      <div id="topbar" :style="{width: layout.windowWidth}">
        <div class="centered" :style="{width: layout.centeredWidth}">
          <div id="topbar-left">
            <img class="trHv" src="../../assets/img/topbar_menu.png">
            <img class="trHv logo" @click="goToMain()" src="../../assets/img/logo_goodatme.png">
              <div class="rollover">
                <div class="trHv" @click="setPopup('0', 'favorite')">favorite</div>
                <div class="trHv" @click="setPopup('0', 'calendar')">calendar</div>
                <div class="trHv" @click="setPopup('0', 'eat')">eat</div>
                <div class="trHv" @click="setPopup('0', 'play')">play</div>
                <div class="trHv" @click="setPopup('0', 'work')">work</div>
                <div class="trHv" @click="setPopup('1', 'about')">about</div>
                <div class="trHv" @click="goToShop()">shop</div>
              </div>
          </div>
          <div id="topbar-right">
            <span v-if="!state.loggedIn">
              <span class="trHv" id="login-btn" @click="setPopup('1', 'login')">
                Login
              </span>
              |
              <span class="trHv" id="login-btn" @click="setPopup('1', 'register')">
                Register
              </span>
            </span>
            <span v-else>
              <span class="trHv" id="mypage-btn" @click="setPopup('1', 'mypage')">
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
            <img class="trHv" @click="setPopup('0', 'search')" src="../../assets/img/topbar_search.png">
          </div>
        </div>
      </div>

      <!-- 컨텐츠 -->
      <div id="contents">
        <!-- 최상단 슬라이드 -->
        <div id="top-slide" class="centered" :style="{width: layout.centeredWidth, height: layout.topSlideH}">
          <div v-if="content.topSlide.list.length > 0" class="black-bg-text"
            :style="{width: layout.centeredWidth, height: layout.topSlideH}"
            @click="openPosting(content.topSlide.list[content.topSlide.selectedIdx].idx)"
            >
            <image-bg :width="layout.centeredWidth" :height="layout.topSlideH"
            :url="content.topSlide.list[content.topSlide.selectedIdx].image"></image-bg>
            <div class="abs darkBg" :style="{width: layout.centeredWidth, height: layout.topSlideH}"></div>
            <div class="abs ctgr" :style="placeInsideTopSlide('ctgr')">
              _{{content.topSlide.list[content.topSlide.selectedIdx].category}}
            </div>
            <div class="abs title" :style="placeInsideTopSlide('title')">
              <img :style="placeInsideTopSlide('img')"
              :src="'http://13.125.24.19:8001/interface/outline_' + content.topSlide.list[content.topSlide.selectedIdx].shape + '.png'">
              <br>{{content.topSlide.list[content.topSlide.selectedIdx].title}}
            </div>
            <div class="abs subCtgr" :style="placeInsideTopSlide('subCtgr')">
              {{content.topSlide.list[content.topSlide.selectedIdx].sub_category}}
            </div>
            <div class="abs date-editor" :style="placeInsideTopSlide('date-editor')">
              {{content.topSlide.list[content.topSlide.selectedIdx].createdAt.substring(0, 10).replace(/-/g, '.')}}<br>
              <span>by</span>
              {{content.topSlide.list[content.topSlide.selectedIdx].editor}} 에디터
            </div>
          </div>
          <img class="left" src="../../assets/img/top_slide_left.png" @click="topSlideMove(1)"
          :style="{top: parseInt(layout.topSlideH.replace('px', '') / 2 - 30) + 'px'}"/>
          <img class="right" src="../../assets/img/top_slide_right.png" @click="topSlideMove(-1)"
          :style="{top: parseInt(layout.topSlideH.replace('px', '') / 2 - 30) + 'px'}"/>
        </div>

        <!-- 나의 라이프스타일 띠 -->
        <div id="intro-stripe" :style="introStripeStyle">
          <div id="shape-pattern" :style="shapePatternStyle">
          </div>
          <div class="message" v-if="myShape === 'random'" :style="{width: layout.windowWidth}">
            나를 위한 공간을 찾아보세요.<br>
            <span v-if="!state.loggedIn">
              <span class="trHv" @click="setPopup('1', 'register')">회원가입</span> | <span
              class="trHv" @click="setPopup('1', 'login')">로그인</span>
            </span>
            <span v-if="state.loggedIn" class="trHv" @click="setPopup('1', 'mypage')">나의 라이프스타일 설정하기</span>
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
              May 2018
            </div>
            <div class="more">
              <span class="gray-btn trHv" @click="setPopup('0', 'calendar')">전체보기</span>
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
                  <div class="date">{{posting.createdAt.slice(8, 10)}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 나의 라이프스타일은 -->
        <div v-if="d">
          <div id="my-lifestyle">
            <div class="stripe" :style="{width: layout.windowWidth}">
              <div class="pattern" :style="{width: layout.windowWidth}">
              </div>
              <div class="message" :style="{width: layout.windowWidth}">
                {{myLifestyleMessage}}
              </div>
            </div>
            <div class="edit centered" :style="{width: layout.centeredWidth}">
              <span class="gray-btn trHv" @click="setPopup('1', 'mypage')">편집하기</span>
            </div>
            <div v-if="state.loggedIn" class="subscribings centered" :style="{width: layout.centeredWidth}">
              <div v-for="(shape, idx) in $util.noEmptyStrArray(state.account.shape_sbsc.split(','))"
              :key="idx" v-if="shape !== state.account.shape" class="trHv" :style="{backgroundColor: subscColors[idx]}">
                <img :src="'http://13.125.24.19:8001/interface/subsc_' + shape + '.png'">
              </div>
              <span v-if="$util.noEmptyStrArray(state.account.shape_sbsc.split(',')).length === 0"
              class="trHv" @click="setPopup('1', 'mypage')">구독하시는 라이프스타일이 없습니다.  [추가하기]</span>
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
                <span  @click="setPopup('0',category)" class="gray-btn trHv">전체보기</span>
              </td>
            </tr>
          </table>
          <div class="canvas" :style="{height: content.postings.canvasHeight}">
            <div v-for="(posting, idx) in content.postings[category].list" @click="openPosting(posting.idx)"
            :key="idx" :class="['posting', category]" :style="placePosting(category, idx, false)">
              <image-bg
              :width="placePosting(category, idx, true).width"
              :height="placePosting(category, idx, true).height"
              :url="posting.image">
              </image-bg>
              <div class="abs black-cover" :style="placePosting(category, idx, true)">
              </div>
              <span class="abs title" :style="placeInsidePosting('title')">{{util('strLimit', [posting.title, 12])}}</span>
              <span class="abs subCtgr" :style="placeInsidePosting('subCtgr')">{{posting.sub_category}}</span>
              <span class="abs date" :style="placeInsidePosting('date')">
                {{posting.createdAt.substring(0, 10).replace(/-/g, '.')}}
              </span>
              <div class="abs symbol" :style="placeInsidePosting('symbol')">
                <div :style="codeToColor(posting)">
                  <img :src="'http://13.125.24.19:8001/interface/subsc_' + posting.shape + '.png'">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 샵 -->
        <div id="shop" class="centered" :style="{width: layout.centeredWidth}">
          <span class="label trHv" @click="goToShop()">_shop</span>
        </div>

      </div>
      <div class="popup_0">
        <list-panel v-if="popup_0.length !== 0" :tab="popup_0" :layout="layout" :state="state"></list-panel>
      </div>
      <div class="popup_1">
        <login-popup v-if="popup_1 === 'login'" :layout="layout" :state="state"></login-popup>
        <register-popup v-if="popup_1 === 'register'" :layout="layout" :state="state"></register-popup>
        <mypage-popup v-if="popup_1 === 'mypage' && state.loggedIn" :layout="layout" :state="state"></mypage-popup>
        <write-popup v-if="popup_1 === 'write'" :layout="layout" :state="state" :mode="'write'"></write-popup>
        <write-popup v-if="popup_1[0] == '_'" :layout="layout" :state="state"
        :mode="popup_1.replace('_', '')"></write-popup>
        <posting-popup v-if="popup_1 === 'posting'" :layout="layout" :state="state" :postingOn="postingOn"></posting-popup>
        <about-popup v-if="popup_1 === 'about'" :layout="layout"></about-popup>
      </div>
      <div class="popup_2">
        <question-popup v-if="popup_2 == 'question'" :layout="layout" :state="state"></question-popup>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main.js'
import ImageBg from '../Common/ImageBg'
import LoginPopup from '../Popup/LoginPopup'
import RegisterPopup from '../Popup/RegisterPopup'
import QuestionPopup from '../Popup/QuestionPopup'
import MypagePopup from '../Popup/MypagePopup'
import WritePopup from '../Popup/WritePopup'
import PostingPopup from '../Popup/PostingPopup'
import AboutPopup from '../Popup/AboutPopup'
import ListPanel from '../Popup/List/ListPanel'
const apiUrl = 'http://13.125.24.19:8002/'
export default {
  components: {ImageBg, LoginPopup, RegisterPopup, MypagePopup, WritePopup, PostingPopup, QuestionPopup, ListPanel, AboutPopup},
  name: 'Dashboard',
  data () {
    return {
      categories: ['eat', 'play', 'work'],
      subscColors: this.$util.randomSubscColors(),
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
          sahpe_sbsc: '',
          color_r: '',
          color_g: '',
          color_b: '',
          color_str: '',
          type: ''
        }
      },
      popup_0: '',
      popup_1: '',
      popup_2: '',
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
      this.layout.closeRight = (winW - cntrW) / 2 + 24 + 'px'
      this.layout.topSlideH = cntrW * 0.4 + 'px'
      this.content.calendar.imgWidth = cntrW / 5 - 24 + 'px'
      this.content.calendar.imgHeight = cntrW * 0.1 + 'px'
      this.content.calendar.fontSize = cntrW / 920 + 'em'
      this.content.calendar.briefHeight = cntrW * 0.08 + 'px'
      this.content.postings.canvasHeight = this.centerWCanvasH()[1] + 'px'
      bus.$emit('setBg')
    },
    setPopup (layer, which) {
      this['popup_' + layer] = which
    },
    codeToColor (pst) {
      let offset = 60
      let r = parseInt(pst.color_r) * 85 + offset
      let g = parseInt(pst.color_g) * 85 + offset
      let b = parseInt(pst.color_b) * 85 + offset
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
    topSlideMove (offset) {
      this.content.topSlide.selectedIdx = (this.content.topSlide.selectedIdx + offset + 3) % 3
      bus.$emit('setBg')
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
        this.popup_1 = ''
      }).catch((error) => {
        alert(error.response.data)
      })
    },
    // 토큰으로 로그인
    access () {
      if (this.$cookie.get('token') === undefined) {
        this.logout(false)
        this.getPostings()
      } else {
        this.$axios.get(apiUrl + 'account/access', {
          headers: {
            'token': this.$cookie.get('token')
          }
        }).then((response) => {
          this.updateAccount(response)
          this.popup_1 = ''
          // 대시보드의 컨텐츠 다운로드
          this.getPostings()
        }).catch((error) => {
          alert(error.response.data)
          this.logout(true)
          this.getPostings()
        })
      }
    },
    // 로그인 등 계정을 필요로 하는 작업 후 토큰 등 계정정보 업데이트
    updateAccount (response) {
      // 유저정보가 최상위에 있는 JSON일 때와 account 안에 다시 들어있는 JSON일 때 구분
      // console.log(response.data)
      var data = response.data.token !== undefined ? response.data : response.data.account
      // console.log(data)
      this.state.account = data.account
      this.state.loggedIn = true
      // console.log(data.token)
      this.$cookie.set('token', data.token, 7)
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
      this.setPopup('1', 'write')
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
    // 조건을 사용자에게 맞춤
    customize (cond) {
      if (this.state.loggedIn) {
        cond.shape = this.state.account.shape
        cond.color_r = this.state.account.color_r
        cond.color_g = this.state.account.color_g
        cond.color_b = this.state.account.color_b
        cond.shape_sbsc = this.state.account.shape_sbsc
      }
      return cond
    },
    getPostings () {
      // 상단 슬라이드 포스팅
      ['eat', 'play', 'work'].map((category, idx) => {
        var cond = {
          category: category,
          importance: -1,
          limit: 1,
          offset: 0
        }
        cond = this.customize(cond)
        this.$axios.post(apiUrl + 'posting/category', this.$qs.stringify(cond), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          this.content.topSlide.list = this.content.topSlide.list.concat(response.data)
          // console.log(this.content.topSlide.list)
        })
      })
      // 달력 포스팅
      this.$axios.get(apiUrl + 'posting')
        .then((response) => {
          this.content.calendar.list = response.data
        })
      // 카테고리별 포스팅
      var categories = ['eat', 'play', 'work']
      categories.map((it, idx) => {
        var cond = {
          category: it
        }
        cond = this.customize(cond)
        this.$axios.post(apiUrl + 'posting/top6', this.$qs.stringify(cond), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          this.content.postings[it].list = response.data
        })
      })
    },
    openPosting (idx) {
      this.postingOn = idx
      this.setPopup('1', 'posting')
    },
    afterPostingUpload () {
      this.popup_1 = ''
      this.getPostings()
    },
    goToShop () {
      window.location.href = 'http://good-at.me'
    },
    goToMain () {
      window.location.href = 'http://9oodat.me'
    }
  },
  computed: {
    myLifestyleMessage: function () {
      return this.state.loggedIn ? `${this.state.account.nickname}님께서 구독중이신 라이프스타일` : '구독할 라이프스타일을 선택하세요.'
    },
    shapeAdj () {
      return this.$consts.shapes[this.myShape][2]
    },
    shapeNick () {
      return this.$consts.shapes[this.myShape][1]
    },
    myShape: function () {
      return this.state.loggedIn && this.state.account.shape != null ? this.state.account.shape : 'random'
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
    // this.setMock()

    bus.$on('setPopup', lw => {
      this.setPopup(lw[0], lw[1])
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
    bus.$on('openPosting', (idx) => {
      this.openPosting(idx)
    })

    // 토큰 로그인 시도
    this.access()
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
