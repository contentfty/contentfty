module.exports = class extends think.Model {
  constructor (...args) {
    super(...args);
    this.spaceId = this.config.spaceId !== undefined || !think.isEmpty(this.config.spaceId) ? this.config.spaceId : '';
    // this.prefix = '';
    // if (this.spaceId !== undefined || !think.isEmpty(this.spaceId)) {
    //   this.prefix = this.spaceId;
    //   this.spaceId = this.spaceId + '_';
    // }
    // this.prefix = 'picker_' + this.appId + '_'
  }

  get tablePrefix () {
    return 'cf_' + this.spaceId;
  }

  /**
   * 根据空间 ID 获取 Model
   * @param modelName
   * @returns {*}
   */
  getModel (modelName) {
    return this.model(modelName, {spaceId: this.spaceId})
  }

  /**
   * 处理 metas
   *
   * @param post
   * @returns {Promise.<*>}
   */
  async _formatMeta (list) {
    const _items = [];

    for (const item of list) {
      item.meta = {};
      if (item.metas.length > 0) {
        for (const meta of item.metas) {
          item.meta[meta.meta_key] = meta.meta_value;
        }
      }
      // eslint-disable-next-line prefer-reflect
      delete item.metas;
      _items.push(item);
    }
    return _items;
  }
};
