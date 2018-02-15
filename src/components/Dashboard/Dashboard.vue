<template>
  <div class="dashboard">
    <div id="dashboard_wrapper">
      <!-- 상단바 -->
      <div id="topbar" :style="topbar.layout">
        <div class="centered" :style="{width: layout.centeredWidth}">
          <div id="topbar-left">
            <img class="trHv" src="../../assets/img/topbar_menu.png">
              {{username}}
          </div>
          <div id="topbar-right">
            <span class="trHv" id="login-btn">
              Login
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

        <div id="intro-stripe" :class="'red'">
          <div id="shape-pattern" :class="shapePattern" :style="{width: layout.windowWidth}">
          </div>
          <div class="message" v-if="!state.loggedIn" :style="{width: layout.windowWidth}">
            나를 위한 공간을 찾아보세요.<br>
            <span class="trHv">회원가입</span> | <span class="trHv">로그인</span>
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
      topbar: {
        layout: {
          width: ''
        }
      }
    }
  },
  methods: {
    setSizes () {
      let winW = window.innerWidth
      let cntrW = Math.max(Math.min(winW - 50, 1600), 960)
      this.layout.windowWidth = winW + 'px'
      this.layout.centeredWidth = cntrW + 'px'
      this.layout.topSlideH = cntrW * 0.4 + 'px'
      this.topbar.layout.width = winW + 'px'
    }
  },
  computed: {
    username: function () {
      // 로그인 되었다면 사용자 이름으로, 안 되었다면 설정된 인삿말 중 랜덤
      let consts = require('../../assets/js/consts.js')
      return this.state.loggedIn ? this.state.account.username : window._.sample(consts.usernameGreetings)
    },
    shapePattern: function () {
      return this.state.loggedIn ? this.state.account.shape : 'random'
    }
  },
  mounted () {
    this.setSizes()
    let setSizes = this.setSizes
    window.addEventListener('resize', function () {
      setSizes()
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/dashboard/dashboard.scss';
  @import '../../assets/scss/dashboard/top_slide.scss';
  @import '../../assets/scss/dashboard/intro_stripe.scss';
  @import '../../assets/scss/common/topbar.scss';
</style>
