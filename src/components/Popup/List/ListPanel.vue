<template>
  <div class="list-panel">
    <div class="popup_wrapper" :style="{width: layout.windowWidth, height: layout.windowHeight}">
      <div :style="{width: layout.windowWidth}">
        <!-- 리스트들이 나타나는 곳 -->
        <div id="panel" :style="{width: layout.centeredWidth, minHeight: layout.windowHeight}">
          <div class="list" :style="listStyle">
            <category-thumb v-for="(posting, idx) in categoryList" :key="idx"
            :lrPadding="lrPadding" :state="state" :layout="layout" :posting="posting"></category-thumb>
          </div>
        </div>
        <!-- 상단바 -->
        <div id="panelTop" :style="panelTopStyle">
          <div :class="`button trHv ${tab === 'calendar' ? 'on' : ''}`" @click="setPopupTab('0', 'calendar')">
            calendar
          </div>
          <span>|</span>
          <div :class="`button trHv ${tab === 'eat' ? 'on' : ''}`" @click="setPopupTab('0', 'eat')">
            eat
          </div>
          <div :class="`button trHv ${tab === 'play' ? 'on' : ''}`" @click="setPopupTab('0', 'play')">
            play
          </div>
          <div :class="`button trHv ${tab === 'work' ? 'on' : ''}`" @click="setPopupTab('0', 'work')">
            work
          </div>
          <span>|</span>
          <div :class="`button trHv ${tab === 'favorite' ? 'on' : ''}`" @click="setPopupTab('0', 'favorite')">
            favorite
          </div>
          <span>|</span>
          <div :class="`button trHv ${tab === 'search' ? 'on' : ''}`" @click="setPopupTab('0', 'search')">
            search
          </div>
          <img class="close trHv" @click="setPopup('0', '')" src="../../../assets/img/popup_x_72.png"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../../main.js'
import CategoryThumb from '../../Popup/List/CategoryThumb'
const apiUrl = 'http://13.125.24.19:8002/'
export default {
  components: {CategoryThumb},
  props: ['tab', 'layout', 'state'],
  name: 'ListPanel',
  data () {
    return {
      lrPadding: 64,
      page: 0,
      calendarList: [],
      categoryList: [],
      searchList: []
    }
  },
  methods: {
    setPopup (layer, which) {
      bus.$emit('setPopup', [layer, which])
    },
    setPopupTab (layer, which) {
      bus.$emit('setPopup', [layer, which])
      this.setList(which)
    },
    setList (which) {
      this.calendarList = []
      this.categoryList = []
      this.searchList = []
      if (which === 'calendar') {
        this.getCalendarList(0)
      } else if (which === 'search') {
      } else if (which === 'favorite') {
      } else {
        this.getCategoryList(which, 0)
      }
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
    // 달력 리스트
    getCalendarList (page) {
      this.page = page
      if (page === 0) {
        this.calendarList = []
      }
      var cond = {
        importance: 0,
        limit: 20,
        offset: this.page
      }
      cond = this.customize(cond)
      this.$axios.post(apiUrl + 'posting/calendar', this.$qs.stringify(cond), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => {
        this.calendarList = this.calendarList.concat(response.data)
      })
    },
    // eat, play, work별 리스트
    getCategoryList (which, page) {
      this.page = page
      if (page === 0) {
        this.categoryList = []
      }
      var cond = {
        category: which,
        importance: 0,
        limit: 20,
        offset: this.page
      }
      cond = this.customize(cond)
      this.$axios.post(apiUrl + 'posting/category', this.$qs.stringify(cond), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => {
        this.categoryList = this.categoryList.concat(response.data)
      })
    }
  },
  computed: {
    cw () {
      return parseInt(this.layout.centeredWidth.replace('px', ''))
    },
    panelTopStyle () {
      return {
        left: (parseInt(this.layout.windowWidth.replace('px', '')) - this.cw) / 2 + 'px',
        width: this.cw + 'px'
      }
    },
    listStyle () {
      return {
        padding: `0 ${this.lrPadding}px`
      }
    }
  },
  mounted () {
    this.setList(this.tab)
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../assets/scss/popup/popup_common.scss';
  @import '../../../assets/scss/popup/list/panel.scss';
</style>
