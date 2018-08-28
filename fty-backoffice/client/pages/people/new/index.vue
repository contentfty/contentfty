<template>
  <div>
    <header-cake title="添加新成员"/>

    <div class="c-card c-section-header is-compact">
      <div class="c-section-header__label">
        <span class="c-section-header__label-text">成员资料</span></div>
      <div class="c-section-header__actions"></div>
    </div>
    <div class="c-card c-me-profile-settings">
      <div class="c-edit-gravatar">
        <upload
          :action="uploadAction"
          class="file-picker"
          :accept="accept"
          :max-size="size"
          :on-preview="handlePreview"
          :on-progress="handleProgress"
          :on-success="handleSuccess">
          <div data-tip-target="c-edit-gravatar"
               class="c-edit-gravatar__image-container">
            <div class="drop-zone">
              <div class="drop-zone__content">
                <div>
                    <span class="drop-zone__content-icon">
                      <svgicon name="gridicons-cloud-upload" class="gridicon" style="width: 48px; height: 48px;"/>
                    </span>
                  <span class="drop-zone__content-text">拖放以上传个人资料照片</span>
                </div>
              </div>
            </div>

            <img alt="头像"
                 class="gravatar"
                 :src="form.avatarUrl"
                 height="100%"
                 v-if="form.avatarUrl">
            <svgicon class="gravatar"
                     name="gridicons-user-circle" color="none #008be8" scale="9.375" v-else/>

            <div class="c-edit-gravatar__label-container">

              <svgicon name="gridicons-cloud-upload" class="gridicon" scale="2.25"/>
              <span class="c-edit-gravatar__label">
                {{uploadLabel}}
              </span>

            </div>

          </div>
        </upload>

      </div>
      <form @submit.prevent="handleSubmit">
        <fieldset class="c-form-fieldset">
          <label for="usernameOrEmail" class="c-form-label">用户邮箱</label>
          <input id="usernameOrEmail" name="user_email" class="c-form-text-input"
                 v-model="form.user_email"
                 v-validate="'required|email'"
                 :class="{'c-input': true, 'is-error': errors.has('user_email') }"
                 type="email"
                 placeholder="用户名">
          <form-input-validation
            :isError="errors.has('user_email')"
            v-show="errors.has('user_email')">
            {{ errors.first('user_email') }}
          </form-input-validation>
        </fieldset>
        <fieldset class="c-form-fieldset">
          <label for="user_pass" class="c-form-label">密码</label>
          <input type="text"
                 id="user_pass"
                 name="last_name"
                 value="abcd1234"
                 class="c-form-text-input" disabled>
          <p class="c-form-setting-explanation">
            新用户默认登录密码
            <nuxt-link to="/settings">更改?</nuxt-link>
          </p>
        </fieldset>
        <fieldset class="c-form-fieldset">
          <label for="user_nicename"
                 class="c-form-label">
            公开显示的名字
          </label>
          <input type="text"
                 id="user_nicename"
                 name="display_name"
                 v-model="form.user_nicename"
                 placeholder="对外展示的昵称"
                 class="c-form-text-input">
        </fieldset>
        <fieldset class="c-form-fieldset">
          <label for="role" class="c-form-label">身份</label>
          <select id="role"
                  name="role"
                  class="c-form-select"
                  v-model="form.role">
            <option value="author">作者</option>
            <option value="editor">编辑</option>
            <option value="administrator">管理员</option>
            <!--<option value="contributor">贡献者</option>-->
            <!--<option value="follower">粉丝</option>-->
          </select>
          <p class="c-form-setting-explanation"></p>
        </fieldset>
        <fieldset class="c-form-fieldset">
          <label for="summary" class="c-form-label">简介</label>
          <textarea
            id="summary"
            name="summary"
            placeholder="成员个人介绍"
            class="c-form-textarea"></textarea>
        </fieldset>
        <p>
          <button type="submit" class="c-button c-form-button is-primary">添加</button>
        </p>
      </form>
    </div>

  </div>

</template>
<script>
  import HeaderCake from '~/components/header-cake'
  import Upload from '~/components/upload'
  import Spinner from '~/components/spinner'
  import FormInputValidation from '~/components/forms/form-input-validation'

  import '~/icons/gridicons-cloud-upload'
  import '~/icons/gridicons-user-circle'

  export default {
    components: {
      HeaderCake,
      Spinner,
      FormInputValidation,
      Upload
    },
    data () {
      return {
        size: 1024 * 1024 * 10,
        accept: 'image/png,image/gif,image/jpeg',
        uploading: false,
        form: {
          id: '',
          approach: 'pc',
          meta: {
            avatar: ''
          },
          // user_login: '',
          user_pass: 'abcd1234',
          user_nicename: '',
          user_email: '',
          // user_phone: '',
          role: 'author',
          summary: ''
        },
        isVisible: false
      }
    },
    computed: {
      uploadAction () {
        const baseURL = process.env.baseURL
        return baseURL + '/file'
      },
      uploadLabel () {
        return this.form.avatarUrl ? '点击替换头像' : '点击上传头像'
      },
      requestHeader () {
        return {'Authorization': 'Bearer ' + this.$store.state.token}
      },
      user () {
        return this.$auth.state.user
      },
      newUser () {
        return this.$store.state.users.detail
      }
    },
    methods: {
      handlePreview (url) {
        this.form.avatarUrl = url
      },
      handleProgress (progress) {
        this.uploading = true
      },
      handleSuccess (success, data) {
        this.uploading = false
        this.form.avatarUrl = data.url + '?imageMogr2/thumbnail/300x300/q/90/format/jpg/interlace/1'
        this.form.avatar = data.id
        console.log(this.form.avatar)
      },
      async handleSubmit () {
        const that = this
        that.isSave = true
        await this.$validator.validateAll()
          .then(async (result) => {
            if (result) {
              await this.$store.dispatch('addUser', {form: that.form})
              // if (this.form.id) {
              //   await this.$store.dispatch('updateUser', {form: that.form})
              //   that.isSave = false
              //   this.$router.replace('/people/team')
              // } else {
              //   await this.$store.dispatch('addUser', {form: that.form})
              //   that.isSave = false
              //   console.log(that.newUser.type)
              if (that.newUser.creating && that.newUser.type !== 'exist') {
                this.$router.replace('/people/team')
              } else {
                console.log('创建失败。。。')
              }
              that.isSave = false
              console.log('Correct them errors!')
            }
          })
      }
    }
  }
</script>
<style scoped>
  .gravatar {
    width: 150px;
    height: 150px;
    max-width: 100%;
    max-height: 100%;
  }

  .file-uploads {
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
</style>
