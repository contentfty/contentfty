/*
*
* 全局设置数据状态
*
*/

export const state = () => {
  return {
    // 页面焦点
    layoutFocus: 'sidebar',
    layoutStatus: '',
    // 页面的栏目展示类型（3栏/2栏）
    fullColumn: false,
    errorColumn: false,
    fullWideLayout: false,
    isGroupEditor: false,
    // 是否为移动端
    mobileLayout: false,
    // 移动端侧边栏
    mobileSidebar: false,

    // 是否开启弹幕
    openBarrage: false,

    // ua
    userAgent: '',

    // 服务端博主信息
    adminInfo: {
      fetching: false,
      data: {}
    },

    // 服务端设置的全局配置
    globalOption: {
      fetching: false,
      data: {
        meta: {
          likes: 0
        }
      }
    },

    emoji233333: null
  }
}

export const getters = {
  mobileLayout: state => state.mobileLayout
}

export const mutations = {
  SET_FULL_WIDE_LAYOUT (state, action) {
    state.fullWideLayout = action
  },
  SET_LAYOUT_FOCUS (state, action) {
    state.layoutFocus = 'focus-' + action
  },
  SET_LAYOUT_STATUS (state, action) {
    if (action === 'post' || action === 'post-id') {
      state.layoutStatus = 'is-group-editor is-section-post-editor'
    } else if (action === 'apps') {
      state.layoutStatus = 'is-group-apps'
    } else {
      state.layoutStatus = ''
    }
  },
  SET_NEXT_LAYOUT_FOCUS (state, action) {
  },
  ACTIVATE_NEXT_LAYOUT_FOCUS (state, action) {
  },
  // 设置UA
  SET_USER_AGENT (state, action) {
    state.userAgent = action
  },

  // 设置是否移动端状态
  SET_MOBILE_LAYOUT (state, action) {
    state.mobileLayout = action
  },

  // 切换移动端侧边栏
  SET_MOBILE_SIDEBAR (state, action) {
    state.mobileSidebar = action
  },

  // 设置栏目结构
  SET_FULL_COLUMU (state, action) {
    state.fullColumn = action
  },

  // 设置错误页面模板
  SET_ERROR_COLUMU (state, action) {
    state.errorColumn = action
  },

  // 获取服务端配置的管理员信息
  REQUEST_ADMIN_INFO (state) {
    state.adminInfo.fetching = true
  },
  REQUEST_ADMIN_INFO_SUCCESS (state, action) {
    state.adminInfo.fetching = false
    state.adminInfo.data = action.result
  },
  REQUEST_ADMIN_INFO_FAILURE (state) {
    state.adminInfo.fetching = false
    state.adminInfo.data = {}
  },

  // 获取服务端配置
  REQUEST_GLOBAL_OPTIONS (state) {
    state.globalOption.fetching = true
  },
  REQUEST_GLOBAL_OPTIONS_SUCCESS (state, action) {
    state.globalOption.fetching = false
    state.globalOption.data = action.data
  },
  REQUEST_GLOBAL_OPTIONS_FAILURE (state) {
    state.globalOption.fetching = false
  },

  // 喜欢本站
  LIKE_SITE (state, action) {
    state.globalOption.data.meta.likes++
  },

  // 切换弹幕状态
  UPDATE_BARRAGE_STATE (state, action) {
    if (action !== undefined) {
      state.openBarrage = Boolean(action)
    } else {
      state.openBarrage = !state.openBarrage
    }
  },

  // 设置 emoji233333 实例
  SET_EMOJI_INSTANCE (state, action) {
    state.emoji233333 = action
  }
}
