<template>
  <c-main :wideLayout="isWideLayout">
    <settings-main-header :navs="navList"></settings-main-header>
    <!--<main class="c-app-settings c-main">-->
    <section-nav :navs="navs">
      <button type="button"
              class="c-button is-compact is-primary u-mr-small"
              @click="termModal = true"
              v-if="isRouteCategory">
        添加新分类
      </button>
    </section-nav>
    <setting-browser :visibleSettings="list" v-if="!$route.params.slug"/>
    <nuxt-child/>
    <c-table>
      <table-row isHeader slot="header">
        <table-item v-for="(item, index) in ['home', 'miss', 'like']" :key="index" isHeader>
          {{item}}
        </table-item>
      </table-row>
      <table-row  v-for="(rowItems, rowIndex) in [[ 1, 2, 3 ],[ 4, 5, 6 ],[ 7, 8, 9 ]]" :key="rowIndex">
        <table-item v-for="(rowItem, itemIndex) in rowItems" :key="itemIndex">
          {{rowItem}}
        </table-item>
      </table-row>
    </c-table>
    <!--<term-form-dialog-->
    <!--v-model="termModal"-->
    <!--:model="termModel"-->
    <!--@cancel="cancel"-->
    <!--@visible-change="visibleChange" />-->
    <!--</main>-->
    <div class="c-card table">
      <div class="table__wrapper-shadow">
        <div class="table__wrapper">
          <table>
            <thead>
            <tr class="table-row">
              <th class="table-heading ">
                导航名称
              </th>
              <th class="table-heading"> 导航名称</th>
              <th class="table-heading"> 导航名称</th>
              <th class="table-heading"> 导航名称</th>
            </tr>
            </thead>
            <tbody class="table-heading">
            <tr class="table-row">
              <td class="table-item">1</td>
              <td class="table-item">2</td>
              <td class="table-item">2</td>
              <td class="table-item">2</td>
            </tr>
            <tr class="table-row">
              <td class="table-item">1</td>
              <td class="table-item">2</td>
              <td class="table-item">2</td>
              <td class="table-item">2</td>
            </tr>
            <tr class="table-row">
              <td class="table-item">1</td>
              <td class="table-item">2</td>
              <td class="table-item">2</td>
              <td class="table-item">2</td>
            </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>

  </c-main>

</template>
<script>
  import SectionNav from '~/components/section-nav'
  import TermFormDialog from '~/components/terms/term-form-dialog'
  import CMain from '~/components/main'
  import {SettingsMainHeader} from '~/components/settings'
  import SettingBrowser from '~/components/settings/browser'
  import {CTable, TableItem, TableRow} from '~/components/table'

  export default {
    middleware: 'auth',
    name: 'Settings',
    data () {
      return {
        isHeader: true,
        isWideLayout: true,
        filter: 'publish',
        collapsed: true,
        showDialog: false,
        termModal: false,
        termModel: {},
        SHORT_LIST_LENGTH: 6,
        navList: [
          {name: '基本', slug: 'settings/general'},
          {name: '用户', slug: 'settings/content'},
          {name: '字段', slug: 'settings/tools'}
        ],
        navs: [
          {name: '系统', slug: 'general'},
          {name: '内容', slug: 'content'},
          {name: '工具', slug: 'tools'}
          // {name: '工具', slug: 'settings/taxonomies/category'}
        ],
        list: [{
          group: 'system',
          items: [{
            name: 'general',
            title: '基本',
            icon: '',
            actions: []
          }, {
            name: 'users',
            title: '用户',
            icon: '',
            actions: []
          }, {
            name: 'plugins',
            title: '插件',
            icon: '',
            actions: []
          }]
        }, {
          group: 'content',
          items: [{
            name: 'fields',
            title: '字段',
            icon: '',
            actions: []
          }, {
            name: 'sections',
            title: '版块',
            icon: '',
            actions: []
          }, {
            name: 'assets',
            title: '资产',
            icon: '',
            actions: []
          }, {
            name: 'global',
            title: '全局变量',
            icon: '',
            actions: []
          }, {
            // name: 'taxonomies',
            name: 'categories',
            title: '分类',
            icon: '',
            actions: []
          }, {
            name: 'tags',
            title: '标签',
            icon: '',
            actions: []
          }, {
            name: 'locales',
            title: '区域设置',
            icon: '',
            actions: []
          }]
        }, {
          group: 'tools',
          items: [{
            name: 'updateAssetsIndex',
            title: '更新资产索引',
            icon: '',
            actions: [{
              title: '全部'
            }]
          }, {
            name: 'clearCaches',
            title: '清除缓存',
            icon: '',
            actions: [{
              title: '全部'
            }]
          }, {
            name: 'backupDatabase',
            title: '备份数据库',
            icon: '',
            actions: [{
              title: '要下载备份吗？'
            }]
          }, {
            name: 'resetSearchIndex',
            title: '重建搜索索引'
          }, {
            name: 'findAndReplace',
            title: '查找并替换'
          }]
        }],
        isOpen: false,
        isFocus: false
        // child
      }
    },
    components: {
      SectionNav,
      TermFormDialog,
      SettingsMainHeader,
      CMain,
      SettingBrowser,
      CTable,
      TableRow,
      TableItem
      // CModal
    },
    mounted () {
      console.log('mounted')
      // this.$on('edit-term', (term) => {
      //   this.termModel = term
      //   this.termModal = true
      // console.log(this.termModel)
      // console.log(term)
      // })
      // this.$router.push('/settings/general')
    },
    async fetch ({store, params}) {
      await store.dispatch('getFields')
    },
    computed: {
      isRouteCategory () {
        return this.$route.name === 'settings-taxonomies-category'
      },
      isParent () {
        return this.$route.name === 'settings-general'
      },
      categories () {
        // return this.$store.state.categories.data.list
      },
      user () {
        // return this.$store.state.user
      },
      emptyTitle () {
        switch (this.filter) {
          case 'publish': {
            return '没有节目内容'
          }
          case 'drafts': {
            return '没有待审核的内容'
          }
          case 'off': {
            return '没有下架内容'
          }
          case 'trashed': {
            return '没有已放入回收站的内容'
          }
          default: {
            return '还没节目内容'
          }
        }
      },
      isNotEmpty () {
        return this.posts.data.length > 0
      },
//      timestamp: function () {
//        return this.$moment(this.posts.attributes.modified).format('YYYY-MM-DD [at] hh:mm')
//      },
      posts () {
        return this.$store.state.posts.list
      },
      options () {
        return this.$store.state.options.globalOption.data
      },
      classes () {
        return [
          'post-image',
          {
            'is-collapsed': this.collapsed
          }
        ]
      },
      searchClass () {
        return [
          'is-expanded-to-container',
          {
            'is-open': this.isOpen
          },
          {
            'has-focus': this.isFocus
          },
          'has-open-icon',
          'search'
        ]
      }
    },
    methods: {
      toggleSearch () {
        this.isOpen = !this.isOpen
        this.isFocus = !this.isFocus
      },
      cancel () {
        this.termModal = false
      },
      visibleChange (visible) {
        this.termModal = visible
      },
      handleClick () {
        this.collapsed = !this.collapsed
      }
    }
  }
</script>
