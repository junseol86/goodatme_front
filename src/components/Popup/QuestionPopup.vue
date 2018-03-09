<template>
  <div class="question-popup">
    <div class="popup_wrapper" :style="{width: layout.windowWidth, height: layout.windowHeight}">
        <div v-if="questions.length !== 0 && questions.length > choices.length" id="question" :style="popupStyle">
          <div :style="indicatorStyle">
            성향 테스트
            <span> ({{choices.length + 1}}/{{questions.length}})</span>
          </div>
          <div :style="questionStyle">{{questions[choices.length].question}}</div>
          <div :style="choiceStyle" class="choice" @click="makeChoice(1)">{{questions[choices.length].positive}}</div>
          <div :style="choiceStyle" class="choice" @click="makeChoice(-1)">{{questions[choices.length].negative}}</div>
          <br>
          <div v-if="choices.length > 0" class="trHv" :style="backStyle" @click="prevQuestion()">← 이전 질문</div>
          <img class="trHv close" src="../../assets/img/popup_x.png" @click="setPopup('2', '')"/>
        </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main.js'
const apiUrl = 'http://13.125.24.19:8002/'
export default {
  props: ['layout', 'state'],
  name: 'LoginPopup',
  data () {
    return {
      questions: [],
      choices: []
    }
  },
  methods: {
    setPopup (idx, which) {
      bus.$emit('setPopup' + idx, which)
    },
    getQuestions () {
      this.$axios.get(apiUrl + 'question/question').then((response) => {
        this.questions = response.data
      }).catch((error) => {
        alert(error.response.data)
      })
    },
    score () {
      var shapes = ['circle', 'triangle', 'square', 'star', 'infinity', 'clover', 'diamond', 'heart', 'spade']
      var score = {
        circle: 0,
        triangle: 0,
        square: 0,
        star: 0,
        infinity: 0,
        clover: 0,
        diamond: 0,
        heart: 0,
        spade: 0
      }
      var _this = this
      this.choices.map((choice, idx) => {
        shapes.map((shape) => {
          var vl = _this.questions[idx][shape] * choice
          score[shape] += vl > 0 ? vl : 0
        })
      })
      var max = 0
      var winner = ''
      shapes.map((shape) => {
        if (score[shape] > max) {
          max = score[shape]
          winner = shape
        }
      })
      console.log(winner)
    },
    makeChoice (which) {
      this.choices.push(which)
      if (this.choices.length === this.questions.length) {
        this.score()
      }
    },
    prevQuestion () {
      this.choices.pop()
    }
  },
  computed: {
    cw () {
      return parseInt(this.layout.centeredWidth.replace('px', ''))
    },
    popupStyle () {
      return {
        width: this.cw * 0.8 + 'px',
        height: this.cw * 0.34 + 'px'
      }
    },
    indicatorStyle () {
      return {
        fontSize: this.cw / 1100 + 'em'
      }
    },
    questionStyle () {
      return {
        fontSize: this.cw / 700 + 'em',
        marginTop: this.cw / 15 + 'px',
        marginBottom: this.cw / 40 + 'px'
      }
    },
    choiceStyle () {
      return {
        fontSize: this.cw / 1000 + 'em',
        width: this.cw * 0.7 + 'px',
        height: this.cw * 0.04 + 'px',
        lineHeight: this.cw * 0.04 + 'px',
        border: '2px solid #ddd',
        borderRadius: this.cw * 0.02 + 'px',
        display: 'inline-block',
        marginBottom: this.cw / 120 + 'px'
      }
    },
    backStyle () {
      return {
        fontSize: this.cw / 900 + 'em',
        marginTop: this.cw / 22 + 'px'
      }
    }
  },
  mounted () {
    this.getQuestions()
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/popup/popup_common.scss';
  @import '../../assets/scss/popup/question.scss';
</style>
