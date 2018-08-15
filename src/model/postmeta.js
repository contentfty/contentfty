/* eslint-disable prefer-promise-reject-errors,no-console,no-case-declarations,default-case,no-undef */
// const {PasswordHash} = require('phpass');
const Base = require('./base');

module.exports = class extends Base {
  // constructor(...args) {
  //   super(...args);
  //   this.appId = ''
  //   if (this.config['appId'] !== undefined) {
  //     this.appId = this.config['appId'] + '_'
  //   }
  // }
  //
  // get tablePrefix() {
  //   return 'picker_'+ this.appId;
  // }
  async getAttachment (type, post_id) {
    let query = {}
    query.post_id = post_id
    if (!think.isEmpty(query.post_id)) {
      switch (type) {
        case 'file': {
          query = think.extend({'meta_key': '_attachment_file'}, query)
          const attachment = await this.where(query).find()
          if (!think.isEmpty(attachment)) {
            return JSON.parse(attachment.meta_value)
          }
          return ''
        }
        case 'meta':
          break
      }
    }
  }

  /**
   * 根据 id 批量获取附件内容
   * @param ids
   * @returns {Promise<any>}
   */
  async getAttachments (ids) {
    let query = {}
    query = think.extend({'meta_key': '_attachment_file'}, query)
    const list = await this.where({
      post_id: ['IN', ids],
      'meta_key': '_attachment_file'
    }).select()
    // _formatMeta(list)
    return list
  }

  async save (post_id, meta) {
    for (const key of Object.keys(meta)) {
      await this.thenUpdate({
        'post_id': post_id,
        'meta_key': key,
        'meta_value': meta[key] + ''
      }, {post_id: post_id, meta_key: key})
    }
  }

  // async addMeta (user_id, post_id) {
  //   await this.add({
  //     post_id: id,
  //     meta_key: '_liked',
  //     meta_value: ['exp', `JSON_ARRAY(JSON_OBJECT('id', ${userId}))`]
  //   })
  // }
  async getMeta (post_id, key) {
    const data = await this.where({post_id: post_id, meta_key: key}).find()
    return data
  }

  // async getThumbnail(post_id) {
  //   let query = {}
  //   query.post_id = post_id
  //   query = think.extend({'meta_key': '_thumbnail_id'}, query)
  //   let thumbnail = await this.where(query).find()
  //   return JSON.parse(attachment['meta_value'])
  // }

  /**
   * 统计内容喜欢的人数
   *
   * @param post_id
   * @returns {Promise.<number|*>}
   */
  async getLikedCount (post_id) {
    const total = await this.field('JSON_LENGTH(meta_value) as like_count').where({
      post_id: post_id,
      meta_key: '_liked'
    }).find()
    if (!think.isEmpty(total)) {
      return total.like_count
    } else {
      return 0
    }
  }

  /**
   * 统计点赞的人数
   *
   * @param post_id
   * @returns {Promise.<number|*>}
   */
  async getThumbsCount (post_id) {
    const total = await this.field('JSON_LENGTH(meta_value) as thumbs_count').where({
      post_id: post_id,
      meta_key: '_thumbs'
    }).find()
    if (!think.isEmpty(total)) {
      return total.thumbs_count
    } else {
      return 0
    }
  }

  /**
   * 统计点赞的人数
   *
   * @param post_id
   * @returns {Promise.<number|*>}
   */
  async getViewCount (post_id) {
    const total = await this.field('JSON_LENGTH(meta_value) as thumbs_count').where({
      post_id: post_id,
      meta_key: '_post_views'
    }).find()
    if (!think.isEmpty(total)) {
      return total.thumbs_count
    } else {
      return 0
    }
  }
  /**
   * 点赞
   * @param user_id
   * @param post_id
   * @param ip
   * @param date
   * @returns {Promise<void>}
   */
  async newThumb (user_id, post_id, ip, date) {
    await this.where({
      post_id: post_id,
      meta_key: '_thumbs'
    }).update({
      'post_id': post_id,
      'meta_key': '_thumbs',
      'meta_value': ['exp', `JSON_ARRAY_APPEND(meta_value, '$', JSON_OBJECT('id', '${user_id}','ip', '${_ip2int(ip)}', 'date', '${date}', 'modified', '${new Date().getTime()}'))`]
    })
  }
  /**
   * 取赞
   * @param user_id
   * @param post_id
   * @returns {Promise<number>}
   */
  async unThumb (user_id, post_id) {
    const res = await this.where(`post_id = '${post_id}' AND meta_key = '_thumbs' AND JSON_SEARCH(meta_value, 'one', ${user_id}) IS NOT NULL`).update({
        'meta_value': ['exp', `JSON_REMOVE(meta_value, SUBSTRING_INDEX(REPLACE(JSON_SEARCH(meta_value, 'one', '${user_id}', NULL, '$**.id'), '"', ''), '.', 1))`]
      }
    )
    return res
  }

  /**
   * 添加新喜欢的人员
   * @param user_id
   * @param post_id
   * @returns {Promise.<void>}
   */
  async newLike (user_id, post_id, ip, date) {
    await this.where({
      post_id: post_id,
      meta_key: '_liked'
    }).update({
      'post_id': post_id,
      'meta_key': '_liked',
      'meta_value': ['exp', `JSON_ARRAY_APPEND(meta_value, '$', JSON_OBJECT('id', '${user_id}','ip', '${_ip2int(ip)}', 'date', '${date}', 'modified', '${new Date().getTime()}'))`]
    })
  }
  /**
   * 更新 Like 日期
   * @param userId
   * @param postId
   * @param date
   * @returns {Promise<number>}
   */
  async updateLikeDate (userId, postId, date) {
    // CONCAT(SUBSTRING_INDEX(replace(JSON_SEARCH(meta_value, 'one', '3', NULL , '$**.id')
    // 这个是为了处理 JSON 返回的值 $[0] 这样的，来处理对应的 json array 下的 json object Key value
    const res = await this.where(`post_id = '${postId}' AND meta_key = '_liked' AND JSON_SEARCH(meta_value, 'one', ${userId}) IS NOT NULL`).update({
      'meta_value': ['exp', `JSON_REPLACE(meta_value, CONCAT(SUBSTRING_INDEX(replace(JSON_SEARCH(meta_value, 'one', '${userId}', NULL , '$**.id'), '"', ''), '.', 1),'.date'), '${date}')`]
    })
    return res
  }
  /**
   * UnLike post
   * @param user_id
   * @param post_id
   * @returns {Promise<number>}
   */
  async unLike (user_id, post_id) {
    const res = await this.where(`post_id = '${post_id}' AND meta_key = '_liked' AND JSON_SEARCH(meta_value, 'one', ${user_id}) IS NOT NULL`).update({
        'meta_value': ['exp', `JSON_REMOVE(meta_value, SUBSTRING_INDEX(REPLACE(JSON_SEARCH(meta_value, 'one', '${user_id}', NULL, '$**.id'), '"', ''), '.', 1))`]
      }
    )
    return res
  }

  /**
   * 添加新喜欢的人员
   * @param user_id
   * @param post_id
   * @returns {Promise.<void>}
   */
  async newViewer (user_id, post_id, ip) {
    await this.where({
      post_id: post_id,
      meta_key: '_post_views'
    }).update({
      'post_id': post_id,
      'meta_key': '_post_views',
      'meta_value': ['exp', `JSON_ARRAY_APPEND(meta_value, '$', JSON_OBJECT('id', '${user_id}','ip', '${_ip2int(ip)}', 'date', '${new Date().getTime()}'))`]
    })
  }
  /**
   * 更新 Like 日期
   * @param userId
   * @param postId
   * @param date
   * @returns {Promise<number>}
   */
  async updateViewDate (userId, postId, ip) {
    // CONCAT(SUBSTRING_INDEX(replace(JSON_SEARCH(meta_value, 'one', '3', NULL , '$**.id')
    // 这个是为了处理 JSON 返回的值 $[0] 这样的，来处理对应的 json array 下的 json object Key value
    const res = await this.where(`post_id = '${postId}' AND meta_key = '_post_views' AND JSON_SEARCH(meta_value, 'one', ${userId}) IS NOT NULL`).update({
      'meta_value': ['exp', `JSON_REPLACE(meta_value, CONCAT(SUBSTRING_INDEX(replace(JSON_SEARCH(meta_value, 'one', '${userId}', NULL , '$**.id'), '"', ''), '.', 1),'.date'), '${new Date().getTime()}')`]
    })
    return res
  }
  /**
   * 删除关联的 item 项目
   * @param postId
   * @param itemId
   * @returns {Promise<number>}
   * @deprecated
   */
  async removeItem (postId, itemId) {
    const res = await this.where(`post_id = '${postId}' AND meta_key = '_items' AND JSON_SEARCH(meta_value, 'one', ${itemId}) IS NOT NULL`).update({
      'meta_value': ['exp', `JSON_REMOVE(meta_value, SUBSTRING_INDEX(replace(JSON_SEARCH(meta_value, 'one', '${itemId}', NULL , '$**.id'), '"', ''), '.', 1))`]
    })
    const {items} = await this.field(`meta_value as items`).where(`post_id = '${postId}' AND meta_key = '_items'`).find()
    return JSON.parse(items)
  }

  /**
   * 删除关联的资源项目
   * @param postId
   * @param assetId
   * @returns {Promise<any>}
   */
  async removeAsset (postId, assetId) {
    const res = await this.where(`post_id = '${postId}' AND meta_key = '_assets' AND JSON_SEARCH(meta_value, 'one', ${assetId}) IS NOT NULL`).update({
      'meta_value': ['exp', `JSON_REMOVE(meta_value, SUBSTRING_INDEX(replace(JSON_SEARCH(meta_value, 'one', '${assetId}', NULL , '$**.id'), '"', ''), '.', 1))`]
    })
    const {items} = await this.field(`meta_value as assets`).where(`post_id = '${postId}' AND meta_key = '_assets'`).find()
    return JSON.parse(items)
  }
  /**
   * 更新关联的 并没有 状态
   * @param postId
   * @param assetId
   * @param status
   * @returns {Promise<number>}
   */
  async changeAssetStatus (postId, assetId, status) {
    // CONCAT(SUBSTRING_INDEX(replace(JSON_SEARCH(meta_value, 'one', '3', NULL , '$**.id')
    // 这个是为了处理 JSON 返回的值 $[0] 这样的，来处理对应的 json array 下的 json object Key value
    const res = await this.where(`post_id = '${postId}' AND meta_key = '_assets' AND JSON_SEARCH(meta_value, 'one', ${assetId}) IS NOT NULL`).update({
      'meta_value': ['exp', `JSON_REPLACE(meta_value, CONCAT(SUBSTRING_INDEX(replace(JSON_SEARCH(meta_value, 'one', '${assetId}', NULL , '$**.id'), '"', ''), '.', 1),'.status'), '${status}')`]
    })
    return res
  }

  /**
   * 关联资源对象
   * @param postId
   * @param assetId
   * @param status
   * @returns {Promise<void>}
   */
  async relationAsset (postId, assetId, status) {
    // 每次添加插入至顶部
    await this.where({
      post_id: postId,
      meta_key: '_assets'
    }).update({
      'post_id': postId,
      'meta_key': '_assets',
      'meta_value': ['exp', `JSON_ARRAY_INSERT(meta_value, '$[0]', JSON_OBJECT('id', '${assetId}','status', '${status}'))`]
    })
  }
  /**
   * 关联 Item 对象
   * @param postId
   * @param itemId
   * @param status
   * @returns {Promise<void>}
   * @deprecated
   */
  async related (postId, itemId, status) {
    // 每次添加插入至顶部
    await this.where({
      post_id: postId,
      meta_key: '_items'
    }).update({
      'post_id': postId,
      'meta_key': '_items',
      'meta_value': ['exp', `JSON_ARRAY_INSERT(meta_value, '$[0]', JSON_OBJECT('id', '${itemId}','status', '${status}'))`]
    })
  }

  /**
   * 更新关联的 Item 状态
   * @param postId
   * @param itemId
   * @param status
   * @returns {Promise<number>}
   * @deprecated
   */
  async changeItemStatus (postId, itemId, status) {
    // CONCAT(SUBSTRING_INDEX(replace(JSON_SEARCH(meta_value, 'one', '3', NULL , '$**.id')
    // 这个是为了处理 JSON 返回的值 $[0] 这样的，来处理对应的 json array 下的 json object Key value
    const res = await this.where(`post_id = '${postId}' AND meta_key = '_items' AND JSON_SEARCH(meta_value, 'one', ${itemId}) IS NOT NULL`).update({
      'meta_value': ['exp', `JSON_REPLACE(meta_value, CONCAT(SUBSTRING_INDEX(replace(JSON_SEARCH(meta_value, 'one', '${itemId}', NULL , '$**.id'), '"', ''), '.', 1),'.status'), '${status}')`]
    })
    return res
  }

  /**
   * 获取用户是否 like a post
   * @param user_id
   * @param post_id
   * @returns {Promise.<{like_count: number, contain: number}>}
   */
  async getLikeStatus (user_id, post_id) {
    const data = await this.field(`JSON_LENGTH(meta_value) AS like_count, JSON_CONTAINS(meta_value, '[{"id": "${user_id}"}]') AS contain`).where(`meta_key = '_liked' and post_id = ${post_id}`).find()
    if (!think.isEmpty(data)) {
      if (!Object.is(data.contain, undefined)) {
        // return true
        return data
      }
    }
    return {'like_count': 0, 'contain': 0}
  }


  /**
   * 获取用户是否 thumb a post
   * @param user_id
   * @param post_id
   * @returns {Promise.<{like_count: number, contain: number}>}
   */
  async getThumbStatus (user_id, post_id) {
    const data = await this.field(`JSON_LENGTH(meta_value) AS like_count, JSON_CONTAINS(meta_value, '[{"id": "${user_id}"}]') AS contain`).where(`meta_key = '_thumbs' and post_id = ${post_id}`).find()
    if (!think.isEmpty(data)) {
      if (!Object.is(data.contain, undefined)) {
        // return true
        return data
      }
    }
    return {'thumbs_count': 0, 'contain': 0}
  }
}
