<template>
  <div class="list-panel">
    <div class="popup_wrapper" :style="{width: layout.windowWidth, height: layout.windowHeight}"
    ref="scrollCon" @scroll="onScroll()">
      <div :style="{width: layout.windowWidth}" ref="scroll">
        <!-- 리스트들이 나타나는 곳 -->
        <div id="panel" :style="{width: layout.centeredWidth, minHeight: layout.windowHeight}">
          <div class="list" :style="listStyle">
            <category-thumb v-for="(posting, idx) in categoryList" :key="idx"
            :lrPadding="lrPadding" :state="state" :layout="layout" :posting="posting"></category-thumb>
            <calendar-thumb v-for="(posting, idx) in calendarList" :key="idx"
            :lrPadding="lrPadding" :state="state" :layout="layout" :posting="posting"
            :idx="idx"
            ></calendar-thumb>
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
import CalendarThumb from '../../Popup/List/CalendarThumb'
import CategoryThumb from '../../Popup/List/CategoryThumb'
const apiUrl = 'http://13.125.24.19:8002/'
export default {
  components: {CategoryThumb, CalendarThumb},
  props: ['tab', 'layout', 'state'],
  name: 'ListPanel',
  data () {
    return {
      lrPadding: 64,
      page: 0,
      loadMore: false,
      calendarList: [],
      categoryList: [],
      searchList: []
    }
  },
  methods: {
    onScroll () {
      if (!this.loadMore) {
        return
      }
      if (this.$refs.scrollCon.scrollTop > this.$refs.scroll.clientHeight - (this.$refs.scrollCon.clientHeight * 1.5)) {
        console.log(this.page)
        this.page += 1
        this.loadList(this.tab, this.page)
      }
    },
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
      this.loadMore = true
      this.loadList(which, 0)
    },
    loadList (which, page) {
      if (which === 'calendar') {
        this.getCalendarList(page)
      } else if (which === 'search') {
      } else if (which === 'favorite') {
      } else {
        this.getCategoryList(which, page)
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
      if (!this.loadMore) {
        return
      }
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
      this.loadMore = false
      this.$axios.post(apiUrl + 'posting/calendar', this.$qs.stringify(cond), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => {
        if (response.data.length !== 0) {
          var withMY = []
          response.data.map((it, idx) => {
            if (this.showMonthYear(response.data, idx)) {
              withMY.push({
                showMonthYear: true,
                createdAt: it.createdAt
              })
            }
            it.showMontyYear = false
            withMY.push(it)
          })
          this.calendarList = this.calendarList.concat(withMY)
          this.loadMore = response.data.length > 0
        }
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
      this.loadMore = false
      this.$axios.post(apiUrl + 'posting/category', this.$qs.stringify(cond), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => {
        this.loadMore = response.data.length > 0
        this.categoryList = this.categoryList.concat(response.data)
      })
    },
    showMonthYear (list, idx) {
      if (idx < list.length - 1) {
        if (idx === 0) {
          if (this.calendarList.length === 0) {
            return true
          } else if (this.calendarList[this.calendarList.length - 1].createdAt.substring(0, 7) !==
          list[idx].createdAt.substring(0, 7)) {
          }
        } else if (list[idx - 1].createdAt.substring(0, 7) !== list[idx].createdAt.substring(0, 7)) {
          return true
        }
      }
      return false
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
