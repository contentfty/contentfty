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

  async saveEntry (type, data, env) {
    // const environment = env ? 'master' : env
    let entriesModel = this.getModel('entries')
    let entryModel = this.getModel('entryversions')
    if (type === 'draft') {
      //
      entryModel = this.getModel('entrydrafts')
      // const versionModel = this.getModel('entryversions')
    }

  }

  async findByGroupId (groupId, page, pageSize) {
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
