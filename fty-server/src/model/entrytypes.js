/* eslint-disable no-undef,no-return-await,no-console */
const Base = require('./base');

/**
 * model
 */
module.exports = class extends Base {

  /**
   * 按内容类型 id 查找内容
   * @param typeId
   * @returns {Promise<any>}
   */
  async getById(typeId) {
    const userModel = this.model('users')
    const oneData = await this.where({ id: typeId }).find()
    oneData.createdBy = await userModel.getById(oneData.createdBy)
    oneData.updatedBy = await userModel.getById(oneData.updatedBy)
    oneData.fields = JSON.parse(oneData.fields)
    if (oneData.fields.length > 0) {
      const fieldsList = await this.model('fields', { spaceId: this.spaceId }).where({
        id: ['IN', oneData.fields],
        typeId: typeId
      }).order(`INSTR (',${oneData.fields},', CONCAT(',',id,','))`).select()
      oneData.fields = fieldsList
    }
    return oneData
  }
  /**
   * 保存内容类型
   * @param entryType
   * @param userId
   * @returns {Promise<void>}
   */
  async save(entryType, userId) {
    const saveAttr = {
      id: entryType.id,
      name: entryType.name,
      fields: JSON.stringify([]),
      createdBy: userId,
      updatedBy: userId,
      createdAt: dateNow(),
      updatedAt: dateNow()
    }
    await this.add(saveAttr)
    return saveAttr
  }
};
