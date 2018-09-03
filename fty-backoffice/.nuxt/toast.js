import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {})

export default function (ctx, inject) {
  inject('toast', Vue.toasted)
}