<template>
  <div class="list-panel">
    <div class="popup_wrapper" :style="{width: layout.windowWidth, height: layout.windowHeight}">
      <div :style="{width: layout.windowWidth}">
        <div id="panel" :style="{width: layout.centeredWidth, minHeight: layout.windowHeight}">
          <div class="list">
          </div>
        </div>
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
import ImageBg from '../../Common/ImageBg'
// const apiUrl = 'http://13.125.24.19:8002/'
export default {
  components: {ImageBg},
  props: ['tab', 'layout', 'state'],
  name: 'ListPanel',
  data () {
    return {
    }
  },
  methods: {
    setPopup (layer, which) {
      bus.$emit('setPopup', [layer, which])
    },
    setPopupTab (layer, which) {
      bus.$emit('setPopup', [layer, which])
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
    }
  },
  mounted () {
    console.log(this.layout)
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../assets/scss/popup/popup_common.scss';
  @import '../../../assets/scss/popup/list/panel.scss';
</style>
