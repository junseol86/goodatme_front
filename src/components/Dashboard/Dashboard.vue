<template>
  <div class="dashboard">
    <div id="dashboard_wrapper">
      <!-- 상단바 -->
      <div id="topbar" :style="{width: layout.windowWidth}">
        <div class="centered" :style="{width: layout.centeredWidth}">
          <div id="topbar-left">
            <img class="trHv" src="../../assets/img/topbar_menu.png">
              지오오디_에이티.엠이
          </div>
          <div id="topbar-right">
            <span v-if="!state.loggedIn">
              <span class="trHv" id="login-btn">
                Login
              </span>
              |
              <span class="trHv" id="login-btn">
                Register
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
        </div>

        <!-- 나의 라이프스타일 띠 -->
        <div id="intro-stripe" :class="'red'" :style="{width: layout.windowWidth}">
          <div id="shape-pattern" :class="shapePattern" :style="{width: layout.windowWidth}">
          </div>
          <div class="message" v-if="!state.loggedIn" :style="{width: layout.windowWidth}">
            나를 위한 공간을 찾아보세요.<br>
            <span class="trHv">회원가입</span> | <span class="trHv">로그인</span>
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
              <div v-for="posting in content.calendar.list" :key="posting.idx">
                <div>
                  <div class="img" :style="{height: content.calendar.imgHeight}"></div>
                  <div class="category">
                    <span class="ctgr">_{{posting.ctgr}}</span>
                    <span class="subCtgr">{{posting.subCtgr}}</span>
                  </div>
                  <div class="title myeongjo" :style="{fontSize: content.calendar.fontSize}">
                    {{util('strLimit', [posting.title, 12])}}
                  </div>
                  <div class="subtitle" :style="{height: content.calendar.subtitleHeight}">
                    {{util('strLimit', [posting.subtitle, 60])}}
                  </div>
                  <div class="date">{{posting.date}}</div>
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
        </div>

        <!-- 포스팅들 -->
        <div v-for="category in categories" :key="category" class="postings centered" :style="{width: layout.centeredWidth}">
          <table>
            <tr>
              <td width="100">_{{category}}</td>
              <td class="underline"></td>
              <td width="88">
                <span class="gray-btn trHv">전체보기</span>
              </td>
            </tr>
          </table>
          <div class="canvas" :style="{height: postings.canvasHeight}">
            <div v-for="(posting, idx) in postings[category].list"
            :key="posting.idx" :class="['posting', category]" :style="placePosting(category, idx)">
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      categories: ['eat', 'play', 'work'],
      layout: {
        windowWidth: '',
        centeredWidth: '',
        topSlideH: ''
      },
      state: {
        loggedIn: false,
        account: {
          id: '',
          username: '',
          shape: '',
          color: ''
        }
      },
      content: {
        calendar: {
          page: 0,
          list: [],
          imgHeight: '',
          fontSize: '',
          subtitleHeight: ''
        }
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
  },
  methods: {
    util (which, args) {
      let util = require('../../assets/js/util.js')
      return util[which](args)
    },
    centerWCanvasH () {
      let centerW = Math.max(Math.min(window.innerWidth - 50, 1600), 1080)
      return [centerW, centerW / 2]
    },
    setSizes () {
      let winW = window.innerWidth
      let cntrW = this.centerWCanvasH()[0]
      this.layout.windowWidth = winW + 'px'
      this.layout.centeredWidth = cntrW + 'px'
      this.layout.topSlideH = cntrW * 0.4 + 'px'
      this.content.calendar.imgHeight = cntrW * 0.1 + 'px'
      this.content.calendar.fontSize = cntrW / 920 + 'em'
      this.content.calendar.subtitleHeight = cntrW * 0.1 + 'px'
      this.postings.canvasHeight = this.centerWCanvasH()[1] + 'px'
    },
    placePosting (ctgr, idx) {
      let style = {
        width: 0,
        height: 0,
        top: 0,
        left: 0
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
      style.left = this.postings[ctgr].order[hPos[idx]] * (width + padding) + 'px'
      style.top = tops[idx] + 'px'
      style.width = width + 'px'
      style.height = heights[idx] + 'px'
      return style
    },
    setMock () {
      let mock = require('../../assets/js/mock.js')
      this.content.calendar.list = mock.calendar_5

      let _this = this
      this.categories.forEach(function (ctgr) {
        _this.postings[ctgr].list = mock.posting_6
      })
    }
  },
  computed: {
    shapePattern: function () {
      return this.state.loggedIn ? this.state.account.shape : 'random'
    },
    myLifestyleMessage: function () {
      return this.state.loggedIn ? `${this.state.account.username}님께서 구독중이신 라이프스타일` : '당신의 라이프스타일을 선택하세요.'
    }
  },
  mounted () {
    this.setSizes()
    let setSizes = this.setSizes
    window.addEventListener('resize', function () {
      setSizes()
    })
    this.setMock()
  },
  created () {
    let _this = this
    // 카테고리마다의 리스트에서 타일 크기마다의 열 배열 순서를 처음에 무작위 순서로
    this.categories.forEach(function (ctgr) {
      _this.postings[ctgr].order = window._.shuffle([0, 1, 2])
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
</style>
