<template>
  <div class="dashboard_popup">
    <div id="dashboard_popup_wrapper" :style="{width: layout.windowWidth, height: layout.windowHeight}">
      <div id="login">
        <div class="title">로그인</div>
        <input type="text" placeholder="이메일" v-model="email"/><br>
        <input type="password" placeholder="비밀번호" v-model="password"/>
        <div class="buttons">
          <span class="trHv register">회원가입</span>
          <span class="trHv ok" @click="login()">확인</span>
        </div>
        <img class="trHv close" src="../../assets/img/popup_x.png" @click="setPopup('')"/>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main.js'
export default {
  props: ['layout', 'state', 'popup'],
  name: 'Dashboard',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    setPopup (which) {
      bus.$emit('setPopup', which)
    },
    login () {
      bus.$emit('login', [this.email, this.password])
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/dashboard/popup/dashboard_popup.scss';
  @import '../../assets/scss/dashboard/popup/login.scss';
</style>
