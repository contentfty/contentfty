/* eslint-disable no-extra-parens */
import {SettingList} from '~/components/settings'

export default {
  middleware: 'authenticated',
  data () {
    return {
      filter: 'publish',
      collapsed: true,
      SHORT_LIST_LENGTH: 6,
      // visibleSettings: [
      //   {name: '系统', slug: 'system'},
      //   {name: '内容', slug: 'content'},
      //   {name: '工具', slug: 'new'}
      // ],
      isOpen: false,
      isFocus: false,
      category: ''
      // child
    }
  },
  props: {
    visibleSettings: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    SettingList
  },
  methods: {
    handleClick () {
      this.collapsed = !this.collapsed
    },
    getShortList (category) {
      this.$store.dispatch('getPostsShortList', category.slug)
    },
    getFullListView (category) {
    },
    getSearchListView (searchPost) {
    },
    getSingleListView (setting) {
      // this.getShortList(category)
      return (
        <setting-list title={setting.group} list={setting.items} />
      )
    },
    getShortListView () {
      return (
        <span>
          {this.visibleSettings.map((setting, index) => (
            this.getSingleListView(setting)
          ))}
      </span>
      )
    }
  },
  render (h) {
    return this.getShortListView()
  }
}
