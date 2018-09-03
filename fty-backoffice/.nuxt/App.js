import Vue from 'vue'
import NuxtLoading from './components/nuxt-loading.vue'

import '../assets/scss/main.scss'


let layouts = {

  "_apps": () => import('../layouts/apps.vue'  /* webpackChunkName: "layouts/apps" */).then(m => m.default || m),

  "_default": () => import('../layouts/default.vue'  /* webpackChunkName: "layouts/default" */).then(m => m.default || m),

  "_empty": () => import('../layouts/empty.vue'  /* webpackChunkName: "layouts/empty" */).then(m => m.default || m),

  "_logged-out": () => import('../layouts/logged-out.vue'  /* webpackChunkName: "layouts/logged-out" */).then(m => m.default || m),

  "_masterbar/item": () => import('../layouts/masterbar/item.vue'  /* webpackChunkName: "layouts/masterbar/item" */).then(m => m.default || m),

  "_masterbar/logged-in": () => import('../layouts/masterbar/logged-in.vue'  /* webpackChunkName: "layouts/masterbar/logged-in" */).then(m => m.default || m),

  "_masterbar/logged-out": () => import('../layouts/masterbar/logged-out.vue'  /* webpackChunkName: "layouts/masterbar/logged-out" */).then(m => m.default || m),

  "_masterbar/masterbar": () => import('../layouts/masterbar/masterbar.vue'  /* webpackChunkName: "layouts/masterbar/masterbar" */).then(m => m.default || m),

  "_post-editor": () => import('../layouts/post-editor.vue'  /* webpackChunkName: "layouts/post-editor" */).then(m => m.default || m)

}

let resolvedLayouts = {}

export default {
  head: {"title":"fty-backoffice","meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"hid":"description","name":"description","content":"Backoffice"}],"link":[{"rel":"icon","type":"image\u002Fx-icon","href":"\u002Ffavicon.ico"}],"style":[],"script":[]},
  render(h, props) {
    const loadingEl = h('nuxt-loading', { ref: 'loading' })
    const layoutEl = h(this.layout || 'nuxt')
    const templateEl = h('div', {
      domProps: {
        id: '__layout'
      },
      key: this.layoutName
    }, [ layoutEl ])

    const transitionEl = h('transition', {
      props: {
        name: 'layout',
        mode: 'out-in'
      }
    }, [ templateEl ])

    return h('div',{
      domProps: {
        id: '__nuxt'
      }
    }, [
      loadingEl,
      transitionEl
    ])
  },
  data: () => ({
    layout: null,
    layoutName: ''
  }),
  beforeCreate () {
    Vue.util.defineReactive(this, 'nuxt', this.$options.nuxt)
  },
  created () {
    // Add this.$nuxt in child instances
    Vue.prototype.$nuxt = this
    // add to window so we can listen when ready
    if (typeof window !== 'undefined') {
      window.$nuxt = this
    }
    // Add $nuxt.error()
    this.error = this.nuxt.error
  },
  
  mounted () {
    this.$loading = this.$refs.loading
  },
  watch: {
    'nuxt.err': 'errorChanged'
  },
  
  methods: {
    
    errorChanged () {
      if (this.nuxt.err && this.$loading) {
        if (this.$loading.fail) this.$loading.fail()
        if (this.$loading.finish) this.$loading.finish()
      }
    },
    
    setLayout (layout) {
      if (!layout || !resolvedLayouts['_' + layout]) layout = 'default'
      this.layoutName = layout
      let _layout = '_' + layout
      this.layout = resolvedLayouts[_layout]
      return this.layout
    },
    loadLayout (layout) {
      if (!layout || !(layouts['_' + layout] || resolvedLayouts['_' + layout])) layout = 'default'
      let _layout = '_' + layout
      if (resolvedLayouts[_layout]) {
        return Promise.resolve(resolvedLayouts[_layout])
      }
      return layouts[_layout]()
      .then((Component) => {
        resolvedLayouts[_layout] = Component
        delete layouts[_layout]
        return resolvedLayouts[_layout]
      })
      .catch((e) => {
        if (this.$nuxt) {
          return this.$nuxt.error({ statusCode: 500, message: e.message })
        }
      })
    }
  },
  components: {
    NuxtLoading
  }
}

