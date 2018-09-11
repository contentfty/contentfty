<template>

</template>

<script>
  import auth from '~/utils/auth'
  import { mapActions } from 'vuex'

  export default {
    middleware: ['auth'],
    created () {
      const user = this.$store.state.auth.user
      const rootSpace = user.spaces[user.orgs[0]][0].id
      // console.log(user.spaces[user.orgs[0]][0].id)
      // console.log(user.spaces[user.orgs[0]])
      this.$axios.setHeader('x-space-id', rootSpace)
      this.$router.push({
        name: 'spaces-space',
        params: {
          space: rootSpace
          // org: user.orgs[0]
        }
      })
      // const isAuth = auth.isAuth()
      // if (isAuth) {
        // if you hit an unknown
        // we have acceptedRoutes in ~/utils/acceptedRoutes
        // this.getUser()
        //   .then(({data: { user }}) => {
        //     try {
        //       this.$tipeAnalytics.identify(user.id, {
        //         email: user.email,
        //         firstName: user.firstName,
        //         lastName: user.lastName,
        //         createdAt: user.createdAt
        //       }, {
        //         Intercom: {
        //           user_hash: user.intercomHash
        //         }
        //       })
        //     } catch (e) {}
        //     const rootOrg = user.org
        //     const rootFolder = rootOrg.rootFolder
        //     this.$router.push({name: 'org-folder-folder', params: {org: rootOrg.id, folder: rootFolder.id}})
        //   })
        //   .catch(async (e) => {
        //     await this.$message({
        //       title: 'Oh no',
        //       message: 'We are having issues, hang tight, we are on it!',
        //       center: true
        //     })
        //     auth.clearSession()
        //     auth.login()
        //   })
      // }
    },
    methods: {
      ...mapActions({
        getUser: 'auth/user'
      })
    }
  }
</script>

