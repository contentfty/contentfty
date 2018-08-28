/* eslint-disable */
/* eslint-disable prefer-reflect,prefer-spread */
/*
*
* 文章数据状态
*
*/
export const state = () => {
  return {
    creating: false,
    saving: false,
    post: {
      status: '',
      del: '',
      creating: false,
      saving: false,
      deleting: false,
      data: {
        id: 0
      }
    },
    item: {
      creating: false,
      saving: false,
      data: {}
    },
    hot: {
      fetching: false,
      data: {data: []}
    },
    list: {
      fetching: false,
      data: {
        'count': 0,
        'totalPages': 0,
        'pagesize': 10,
        'currentPage': 1,
        'data': []
      }
    },
    fullList: {
      fetching: false,
      data: {
        'count': 0,
        'totalPages': 0,
        'pagesize': 10,
        'currentPage': 1,
        'data': []
      }
    },
    shortLists: {
      fetching: false,
      data: {
        'featured': [],
        'popular': [],
        'new': []
      }
    },
    assetList: {
      fetching: false,
      data: {
        'count': 0,
        'totalPages': 0,
        'pagesize': 10,
        'currentPage': 1,
        'data': []
      }
    },
    detail: {
      fetching: false,
      data: {}
    }
  }
}

export const mutations = {
  // Category Detail post List
  REQUEST_FULL_LIST(state) {
    state.fullList.featching = true
  },
  GET_FULL_LIST_FAILURE (state) {
    state.fullList.fetching = false
  },
  GET_FULL_LIST_SUCCESS (state, action) {
    state.fullList.fetching = false
    state.fullList.data = action.data
  },
  ADD_FULL_LIST_SUCCESS (state, action) {
    state.fullList.fetching = false
    state.fullList.data.data.push.apply(state.fullList.data.data, action.data.data)
    state.fullList.data.count = action.data.count
    state.fullList.data.currentPage = action.data.currentPage
    state.fullList.data.totalPages = action.data.totalPages
    if (state.fullList.data.count === state.fullList.data.data.length) {
      while (state.fullList.data.data.length % 3 !== 0 || state.fullList.data.data.length % 2 !== 0) {
        state.fullList.data.data.push({})
      }
    }
  },
  // Browser List
  REQUEST_SHORT_LIST(state) {
    state.shortLists.featching = true
  },
  GET_SHORT_LIST (state, data) {
    while (data.data.length % 3 !== 0 || data.data.length % 2 !== 0) {
      data.data.push({})
    }
    state.shortLists.data[data.category] = data.data
  },
  // Asset List
  REQUEST_ASSET(state) {
    state.assetList.fetching = true
  },
  GET_ASSET_FAILURE (state) {
    state.assetList.fetching = false
  },
  GET_ASSET_SUCCESS (state, action) {
    state.assetList.fetching = false
    state.assetList.data = action.data
  },
  ADD_ASSET_SUCCESS (state, action) {
    state.assetList.fetching = false
    state.assetList.data.data.push.apply(state.assetList.data.data, action.data.data)
    state.assetList.data.count = action.data.count
    state.assetList.data.currentPage = action.data.currentPage
    state.assetList.data.totalPages = action.data.totalPages
  },
  SET_POST (state, post) {
    state.post = post
  },
  DELETE (state) {
    state.post.del = 'start'
  },
  DELETE_SUCCESS (state) {
    state.post.del = 'success'
  },
  DELETE_FAILURE (state) {
    state.post.del = 'error'
  },
  CREATE (state) {
    state.post.creating = true
  },
  CREATE_SUCCESS (state, action) {
    // state.post.creating = true
    state.post.data.id = action.data
    // Object.assign(state.user, user);
  },
  CREATE_FAILURE (state) {
    state.post.creating = false
  },
  CREATE_CANCEL (state) {
    state.post.creating = false
  },
  UPDATE_ITEM (state) {
    state.saving = true
  },
  UPDATE_ITEM_SUCCESS (state) {
    state.item.saving = false
  },
  // List
  CLEAR_LIST (state) {
    state.list.data = {
      result: {
        pagination: {
          current_page: 0
        },
        data: []
      }
    }
  },
  UPLOAD_FEATURED_IMAGE (state) {
  },
  REQUEST_LIST (state) {
    state.list.fetching = true
  },
  GET_LIST_FAILURE (state) {
    state.list.fetching = false
  },
  GET_LIST_SUCCESS (state, action) {
    state.list.fetching = false
    state.list.data = action.data
  },
  ADD_LIST_SUCCESS (state, action) {
    state.list.fetching = false
    state.list.data.data.push.apply(state.list.data.data, action.result.data)
    state.list.data.pagination = action.result.pagination
  },

  // Hot
  REQUEST_HOT_LIST (state) {
    state.hot.fetching = true
  },
  GET_HOT_LIST_FAILURE (state) {
    state.hot.fetching = false
  },
  GET_HOT_LIST_SUCCESS (state, action) {
    state.hot.fetching = false
    state.hot.data = action.result
  },

  // Detail
  CLEAR_DETAIL (state) {
    state.detail.data = {}
  },
  REQUEST_DETAIL (state) {
    state.detail.fetching = true
  },
  GET_DETAIL_FAILURE (state) {
    state.detail.fetching = false
    state.detail.data = {}
  },
  GET_DETAIL_SUCCESS (state, action) {
    state.detail.fetching = false
    state.detail.data = action.result
  }
}
