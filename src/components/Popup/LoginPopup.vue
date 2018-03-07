<template>
  <div class="login-popup">
    <div class="popup_wrapper" :style="{width: layout.windowWidth, height: layout.windowHeight}">
      <div :style="{width: layout.windowWidth}">
        <div id="login">
          <div class="title">로그인</div>
          <input type="text" placeholder="이메일" v-model="email"/><br>
          <input type="password" placeholder="비밀번호" v-model="password" @keyup="loginEnter"/>
          <div class="buttons">
            <span class="trHv register">회원가입</span>
            <span class="trHv ok" @click="login()">확인</span>
          </div>
          <img class="trHv close" src="../../assets/img/popup_x.png" @click="setPopup('')"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main.js'
export default {
  props: ['layout', 'state'],
  name: 'LoginPopup',
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
    },
    loginEnter (event) {
      if (event.keyCode === 13) {
        this.login()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/popup/popup_common.scss';
  @import '../../assets/scss/popup/login.scss';
</style>
