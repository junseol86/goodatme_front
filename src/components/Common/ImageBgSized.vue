<template>
  <div class="image-bg-sized" v-bind:style="style">
    <div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main.js'
const imgUrl = 'http://13.125.24.19:8001/storage/'
export default {
  props: ['url', 'width'],
  name: 'ImageBgSized',
  data () {
    return {
      style: {
        width: this.width,
        height: '0px',
        backgroundImage: 'url("' + imgUrl + this.url + '")',
        backgroundSize: '',
        backgroundPosition: ''
      }
    }
  },
  methods: {
    setBg () {
      var img = new Image()
      img.src = imgUrl + this.url
      img.onload = () => {
        var imgW = img.width
        var imgH = img.height
        var conW = parseInt(this.width.replace('px', '')) + 16
        var conH = conW * imgH / imgW
        this.style.height = conH + 'px'
        // var conH = parseInt(this.height.replace('px', '')) + 16
        var bgW = 0
        var bgH = 0
        var bgX = 0
        var bgY = 0
        if (imgW / imgH > conW / conH) {
          bgH = conH
          bgW = imgW * conH / imgH
          bgX = -(bgW - conW) / 2
        } else {
          bgW = conW
          bgH = imgH * conW / imgW
          bgY = -(bgH - conH) / 2
        }
        this.style.backgroundSize = `${bgW}px ${bgH}px`
        this.style.backgroundPosition = `${bgX}px ${bgY}px`
        this.style.backgroundImage = 'url("' + imgUrl + this.url + '")'
      }
    }
  },
  mounted () {
    this.setBg()
    bus.$on('setBg', () => {
      this.style.width = this.width
      this.style.height = this.height
      this.setBg()
    })
  }
}

</script>

<style lang="scss" scoped>
</style>
