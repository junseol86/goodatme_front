<template>
  <div class="write-popup">
    <div class="popup_wrapper" :style="{width: layout.windowWidth, height: layout.windowHeight}">
      <div :style="{width: layout.windowWidth}">
        <div id="write" :style="{width: layout.centeredWidth}">
          <div>
            <div>
              <select v-model="posting.category">
                <option value="eat">eat</option>
                <option value="play">play</option>
                <option value="work">work</option>
              </select>
              <input v-model="posting.sub_category" placeholder="부 카테고리(ex: 야식)"/>
            </div>
            <div>
              <input v-model="posting.rgn_do" placeholder="도 또는 특별시"/>
              <input v-model="posting.rgn_sgg" placeholder="시군구(ex: 포항시 북구)"/>
              <input v-model="posting.rgn_emd" class="optional" placeholder="읍면동 (ex: 양덕동, 흥해읍)"/>
              <input v-model="posting.rgn_ri" class="optional" placeholder="리 (ex: 남송리)"/>
            </div>
            <div>
              <select v-model="posting.shape">
                <option value="circle">동그라미</option>
                <option value="clover">클로버</option>
                <option value="diamond">다이아몬드</option>
                <option value="heart">하트</option>
                <option value="infinity">무한</option>
                <option value="spade">스페이드</option>
                <option value="star">별</option>
                <option value="square">네모</option>
                <option value="triangle">세모</option>
              </select>
              <select v-model="posting.color_r">
                <option value="0">R: 낮음</option>
                <option value="1">R: 중간</option>
                <option value="2">R: 높음</option>
              </select>
              <select v-model="posting.color_g">
                <option value="0">G: 낮음</option>
                <option value="1">G: 중간</option>
                <option value="2">G: 높음</option>
              </select>
              <select v-model="posting.color_b">
                <option value="0">B: 낮음</option>
                <option value="1">B: 중간</option>
                <option value="2">B: 높음</option>
              </select>
            </div>
            <div>
              <input type="text" class="long" v-model="posting.place" placeholder="장소명 (ex: 한동카페 양덕점)"/>
            </div>
            <div>
              <input type="text" class="long" v-model="posting.title" placeholder="포스팅 제목"/>
            </div>
            <div>
              <textarea v-model="posting.brief" placeholder="썸네일에 간략히 표시될 3문장 이내의 텍스트"/>
            </div>
            <div>
              <button @click="postingImageDialog()">
                {{posting.image === '' ? '포스팅 이미지 업로드' : '포스팅 이미지 수정'}}
              </button>
              <button v-if="posting.image !== ''" @click="checkImage()">
                이미지 확인
              </button>
              <span></span>
              <input id="postingImage" name="photo" type="file" @change="uploadPostingImage()"/>
            </div>
            <div id="tinymce_container">
              <textarea id="tm_write"></textarea>
            </div>
            <div>
              <input v-model="posting.hashtags" type="text" class="long" placeholder="해시태그 - 쉼표로 구분 (ex: 양덕,야식,분위기)"/>
              <input v-model="posting.importance" type="number" class="optional" placeholder="중요도(비례)"/>
            </div>
            <div>
              <textarea placeholder="html 태그 삽입: 붙여넣기 후 엔터" v-model="htmlToInsert" @keyup.enter="insertContent(htmlToInsert)"/>
            </div>
            <div>
              <button @click="contentImageDialog()">본문 이미지 삽입</button>
              <input id="contentImage" name="photo" type="file" @change="uploadContentImage()"/>
              <button class="right" @click="upload()">
                {{readyToUpload ? '포스팅 업로드' : '필수항목과 포스팅이미지를 작성/업로드 해주세요.'}}
                </button>
            </div>
          </div>
          <img class="trHv close" src="../../assets/img/popup_x.png" @click="finishWrite()"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main.js'
const apiUrl = 'http://13.125.24.19:8002/'
const imgUrl = 'http://13.125.24.19:8001/storage/'
export default {
  props: ['layout', 'state', 'mode'],
  name: 'WritePopup',
  data () {
    return {
      isModify: false,
      editor: {
        initialized: false
      },
      posting: {
        token: '',
        category: 'eat',
        sub_category: '',
        rgn_do: '',
        rgn_sgg: '',
        rgn_emd: '',
        rgn_ri: '',
        shape: 'circle',
        color_r: 0,
        color_g: 0,
        color_b: 0,
        place: '',
        title: '',
        brief: '',
        content: '',
        image: '',
        hashtags: '',
        importance: 0
      },
      htmlToInsert: ''
    }
  },
  methods: {
    finishWrite () {
      this.editor.initialized = false
      window.tinymce.remove('#tm_write')
      bus.$emit('setPopup', ['1', ''])
    },
    initTinyMCE () {
      if (this.editor.initialized !== true) {
        this.editor.initialized = true
        var tinymce = window.tinymce
        tinymce.init({
          selector: '#tm_write',
          toolbar: 'undo redo | styleselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify',
          height: Number(this.layout.windowHeight.replace('px', '')) - 200 + 'px'
        })
      }
    },
    setContent () {
      this.posting.content = window.tinymce.get('tm_write').getContent({format: 'raw'})
    },
    insertContent (element) {
      this.posting.content = window.tinymce.get('tm_write').execCommand('mceInsertContent', false, element)
    },
    postingImageDialog () {
      this.$jq('#postingImage').trigger('click')
    },
    contentImageDialog () {
      this.$jq('#contentImage').trigger('click')
    },
    isImage (extension) {
      var imageFormats = ['jpg', 'jpeg', 'gif', 'png']
      for (var i = 0; i < imageFormats.length; i++) {
        if (extension === imageFormats[i]) {
          return true
        }
      }
      return false
    },
    uploadPostingImage () {
      var input = this.$jq('#postingImage')
      var pathDivided = input.val().split('.')
      var extension = pathDivided[pathDivided.length - 1]
      if (!this.isImage(extension)) {
        alert('이미지 형식이 아닙니다.')
        return
      }
      var formData = new FormData()
      formData.append('photo', input[0].files[0])
      this.$axios.post(apiUrl + 'image/upload', formData, {
        headers: {'content-type': 'multipart/form-data'}
      })
        .then((result) => {
          this.posting.image = result.data.imageUrl
        })
    },
    uploadContentImage () {
      var input = this.$jq('#contentImage')
      var pathDivided = input.val().split('.')
      var extension = pathDivided[pathDivided.length - 1]
      if (!this.isImage(extension)) {
        alert('이미지 형식이 아닙니다.')
        return
      }
      var formData = new FormData()
      formData.append('photo', input[0].files[0])
      this.$axios.post(apiUrl + 'image/upload', formData, {
        headers: {'content-type': 'multipart/form-data'}
      })
        .then((response) => {
          var imgToInsert = `<img style="max-width: 100%;" src="${imgUrl}${response.data.imageUrl}"/>`
          this.insertContent(imgToInsert)
        })
    },
    checkImage () {
      window.open(imgUrl + this.posting.image, '_blank')
    },
    upload () {
      this.posting.token = this.$cookie.get('token')
      var toPost = this.$qs.stringify(this.posting)
      if (this.mode === 'write') {
        if (this.readyToUpload) {
          this.setContent()
          this.$axios.post(apiUrl + 'posting', toPost, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
            .then((response) => {
              bus.$emit('updateAccount', response)
              bus.$emit('afterPostingUpload')
            }).catch(err => {
              console.log(err)
            })
        } else {
          console.log(this.posting)
        }
      } else {
        if (this.readyToUpload) {
          this.setContent()
          this.$axios.post(apiUrl + 'posting/modify', toPost, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
            .then((response) => {
              bus.$emit('updateAccount', response)
              bus.$emit('afterPostingUpload')
            }).catch(err => {
              console.log(err)
            })
        } else {
          console.log(this.posting)
        }
      }
    },
    downloadPosting () {
      this.$axios.get(apiUrl + 'posting/' + this.mode).then((response) => {
        this.writer = response.data.writer
        this.posting = response.data.posting
        this.setContentToModify()
      })
    },
    setContentToModify () {
      var comp = this
      try {
        window.tinymce.get('tm_write').setContent(this.posting.content)
      } catch (err) {
        window.setTimeout(function () {
          comp.setContentToModify(comp.posting.content)
        }, 100)
      }
    }
  },
  computed: {
    readyToUpload: function () {
      return this.posting.image !== '' &&
      this.posting.sub_category.trim() !== '' &&
      this.posting.rgn_do.trim() !== '' &&
      this.posting.rgn_sgg.trim() !== '' &&
      this.posting.place.trim() !== '' &&
      this.posting.title.trim() !== '' &&
      this.posting.brief.trim() !== '' &&
      this.posting.hashtags.trim() !== ''
    }
  },
  mounted () {
    this.initTinyMCE()
    if (this.mode !== 'write') {
      this.downloadPosting()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/popup/popup_common.scss';
  @import '../../assets/scss/popup/write.scss';
</style>
