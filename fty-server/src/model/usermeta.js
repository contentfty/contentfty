/* eslint-disable prefer-promise-reject-errors,no-console */
module.exports = class extends think.Model {
  async save (userId, meta) {
    try {
      for (const key of Object.keys(meta)) {
        await this.thenUpdate({
          'user_id': userId,
          'meta_key': key,
          'meta_value': meta[key] + ''
        }, {user_id: userId, meta_key: key})
      }
    } catch (e) {
      return false
    }
    return true
  }
}
