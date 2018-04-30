<template>
  <div class="register-popup">
    <div class="popup_wrapper" :style="{width: layout.windowWidth, height: layout.windowHeight}">
      <table class="outer_table" :style="{width: layout.centeredWidth}">
        <tbody>
          <tr>
            <td :style="{width: '320px', height: layout.windowHeight}">
              <div>
                <div class="title">회원가입</div>
                <div class="label">* 이메일 주소</div>
                <input type="text" v-model="toSend.email">
                <div class="label">* 비밀번호 / 비밀번호 확인</div>
                <input type="password" v-model="toSend.password" placeholder="영문, 숫자 포함 8자 이상">
                <input type="password" v-model="toSend.passwordCheck">
                <div class="label">* 이름</div>
                <input type="text" v-model="toSend.nickname">
                <div class="label">성별</div>
                  <select v-model="toSend.sex">
                    <option value="">성별을 선택하세요</option>
                    <option value="M">남자</option>
                    <option value="F">여자</option>
                  </select>
                <div class="label">* 나이</div>
                <input type="number" v-model="toSend.age">
                <div class="label">휴대전화 번호</div>
                <input type="text" v-model="toSend.phone" placeholder = "'-' 없이 입력">
              </div>
            </td>
            <td>
              <img class="trHv close" src="../../assets/img/popup_x.png" @click="setPopup('1', '')"/>
              <div class="contractCon" :style="contractStyle">
                <contract></contract>
              </div>
              <div class="submit" @click="submit">
                모두 동의하고 가입하기
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main.js'
import Contract from '../Popup/Contract'
const apiUrl = 'http://13.125.24.19:8002/'
export default {
  components: {Contract},
  props: ['layout', 'state', 'postingOn'],
  name: 'RegisterPopup',
  data () {
    return {
      toSend: {
        email: '',
        password: '',
        passwordCheck: '',
        nickname: '',
        age: '',
        sex: '',
        phone: ''
      }
    }
  },
  methods: {
    setPopup (layer, which) {
      bus.$emit('setPopup', [layer, which])
    },
    submit () {
      if (this.checkOktoSend) {
        this.sendToServer()
      }
    },
    sendToServer () {
      this.$axios.get(apiUrl + 'account/checkEmailExists/' + this.toSend.email)
        .then((response) => {
          if (parseInt(response.data.count) > 0) {
            alert('같은 이메일의 계정이 있습니다.')
          } else {
            this.$axios.post(apiUrl + 'account/register', this.$qs.stringify({
              email: this.toSend.email,
              password: this.toSend.password,
              nickname: this.toSend.nickname,
              age: this.toSend.age,
              sex: this.toSend.sex,
              phone: this.toSend.phone
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then((response) => {
              alert('회원가입이 완료되었습니다.  로그인해주세요.')
              bus.$emit('setPopup', ['1', 'login'])
            }).catch((error) => {
              alert('오류가 발생했습니다.  다시 진행해 주세요.')
              console.log(error)
            })
          }
        })
    }
  },
  computed: {
    cw () {
      return parseInt(this.layout.centeredWidth.replace('px', ''))
    },
    contractStyle () {
      return {
        width: this.cw - 320 - 24 + 'px',
        height: parseInt(this.layout.windowHeight.replace('px', '')) - 112 + 'px'
      }
    },
    checkEmailFormat () {
      var re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(this.toSend.email).toLowerCase())
    },
    safePassword () {
      var re = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d$@$!%*?&er]{8,}/
      return re.test(String(this.toSend.password))
    },
    checkOktoSend () {
      var msg = ''
      if (!this.checkEmailFormat) {
        msg += '이메일 형식을 확인하세요.'
      }
      if (!this.safePassword) {
        msg += (msg.length === 0 ? '' : '\n\n') + '비밀번호는 영문과 숫자를 포함한 8글자 이상이어야 합니다.'
      }
      if (this.toSend.password !== this.toSend.passwordCheck) {
        msg += (msg.length === 0 ? '' : '\n\n') + '비밀번호가 일치하지 않습니다.'
      }
      if (this.toSend.nickname.length === 0) {
        msg += (msg.length === 0 ? '' : '\n\n') + '이름을 입력해주세요.'
      }
      if (this.toSend.age.length === 0) {
        msg += (msg.length === 0 ? '' : '\n\n') + '나이를 입력해주세요.'
      }
      if (msg.length > 0) {
        alert(msg)
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/popup/popup_common.scss';
  @import '../../assets/scss/popup/register.scss';
</style>
