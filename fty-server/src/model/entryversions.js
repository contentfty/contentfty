/* eslint-disable no-undef,no-return-await,no-console */
const Base = require('./base');

/**
 * 内容条目 Model
 */
module.exports = class extends Base {
  async list (type) {

  }
  /**
   * 保存内容条目
   * @param entryId
   * @param createdBy
   * @param typeId
   * @param data
   * @param type
   * @param env
   * @returns {Promise<void>}
   */
  async save ({entryId, createdBy, typeId, data}, type, env) {
    // 新增
    await this.thenAdd({
      id: entryId,
      typeId: typeId,
      createdBy: createdBy,
      postDate: dateNow(),
      createdAt: dateNow(),
      updatedAt: dateNow()
    }, {
      id: entryId
    })

    // 草稿
    if (type === 'draft') {
      // draftModel = this.getModel('entrydrafts')
    } else {
      // 版本
      const versionModel = this.getModel('entryversions')
      const maxNum = await versionModel.where({entryId: entryId}).max('num')
      const inserId = await versionModel.add({
        entryId: entryId,
        num: maxNum ? maxNum + 1 : 1,
        fields: JSON.stringify(data),
        createdBy: createdBy,
        createdAt: dateNow(),
        updatedAt: dateNow()
      })
    }
    await this.where({id: entryId}).update({
      updatedAt: dateNow()
    })
  }
}
