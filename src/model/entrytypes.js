/* eslint-disable no-undef,no-return-await,no-console */
const Base = require('./base');

/**
 * model
 */
module.exports = class extends Base {

  /**
   * 保存内容类型
   * @param entryType
   * @param userId
   * @returns {Promise<void>}
   */
  async save (entryType, userId) {
    const userModel = this.model('users')
    await this.add({
      id: entryType.id,
      name: entryType.name,
      fields: JSON.stringify([]),
      createdBy: userId,
      updatedBy: userId,
      createdAt: dateNow(),
      updatedAt: dateNow()
    })
    const newType = await this.where({id: entryType.id}).find()
    if (!think.isEmpty(newType)) {
      // 待整合进 service
      newType.createdBy = await userModel.getById(userId)
      newType.updatedBy = await userModel.getById(userId)
    }
    return newType
  }
};
