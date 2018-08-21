/* eslint-disable no-undef,no-return-await,no-console */
const Base = require('./base');

/**
 * model
 */
module.exports = class extends Base {
  // constructor(...args) {
  //   super(...args)
  //   this.relation = {
  //     posts: {
  //       type: think.model.HAS_MANY,
  //       relation: false
  //     }
  //   }
  // }

  /**
   * 归属于内容类型的字段列表
   * @param typeId
   * @returns {Promise<*>}
   */
  async list (typeId) {
    const fields = await this.where({
      typeId: typeId
    }).select()

    return fields
  }
  async findByGroupId(groupId, page, pageSize) {
    // console.log(groupId)
    // query = think._.omit(query, ['appId']);
    // console.log(query)
    // const list = await this.model('fields', {appId: this.appId})
    // const list = await this.where(query)
    // .field(fields.join(","))
    // .order('dateUpdated ASC')
    // .page(page, pageSize)
    // .countSelect()
    // return list
    // return this.success(list)
    return await this.model('fields', {appId: 'S11SeYT2W'}).where({groupId: groupId}).select();
  }
};
