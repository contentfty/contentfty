/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path')
const semver = require('semver')

/**
 * 域服务
 * @type {module.exports}
 */
module.exports = class extends think.Service {
  /**
   * init
   *  @param {Array}  file   [备份或还原的文件信息]
   *  @param {Array}  config [备份配置信息]
   *  @param {String} type   [执行类型，export - 备份数据， import - 还原数据]
   * @return {[]}         []
   */
  constructor (config) {
    super()
    this.config = config
  }

  // constructor(file, config, type, ctx) {
  //   super(ctx);
  //   this.file = file;
  //   this.config = config;
  //   this.type = type;
  //   this.ctx = ctx;
  // }
  async create () {
    const db = think.model('mysql', think.config('model'));
    const dbConfig = think.config('model.mysql');
    const dbFile = think.ROOT_PATH + '/scripts/schema.sql';
    if (!think.isFile(dbFile)) {
// eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('数据库文件（schema.sql）不存在，请重新下载');
    }


    let content = fs.readFileSync(dbFile, 'utf8');
    content = content.split('\n').filter(item => {
      item = item.trim();
      const ignoreList = ['#', 'LOCK', 'UNLOCK'];
      for (const it of ignoreList) {
        if (item.indexOf(it) === 0) {
          return false;
        }
      }
      return true;
    }).join(' ');
    content = content.replace(/\/\*.*?\*\//g, '').replace(/cf_/g, dbConfig.prefix + this.config.spaceId + '_' || '');
    //
    // 导入数据
    // model = this.getModel();
    content = content.split(';');

    // await model.query()
    try {
      for (let item of content) {

        item = item.trim();
        if (item) {
          // think.logger.info(item)
          await db.query(item);
        }
      }
      // await model.query(INSERT INTO picker.picker_users (user_login, user_pass, user_nicename, user_email, user_url, user_registered, user_activation_key, user_status, display_name, spam, deleted) VALUES ('baisheng', '$2a$08$8Nces8qHueK2COiQHxg/2.nbjfEesbZdUHV033wkIsmgP6pVLsONu', null, null, null, 1491660103631, 'SklIav8px', 0, null, 0, 0);

    } catch (e) {
      think.logger.error(e)
// eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('数据表导入失败。');
    }

  }

  async init () {
    // 创建内容类型
    // const entryType = think.model('entrytypes')
    // await entryType.addMany([{
    // id: 'user',
    // name: '用户',
    // fields: [{}]
    // }])
    // 用户内容类型
    // 组织内容类型
    // 空间内容类型

    // 创建用户
    // 创建组织
    // 创建应用空间
    // 创建应用空间环境
  }

  /**
   * 注册元素
   * @param type
   * @returns {Promise<*>}
   */
  async regElement (type) {
    const elementModel = think.model('elements', {spaceId: this.spaceId})
    const typeId = type === ElementType.space ? Generate.spaceId() : Generate.id()
    try {
      await elementModel.add({
        id: typeId,
        type: type,
        createdAt: dateNow(),
        updatedAt: dateNow()
      })
      return typeId
    } catch (e) {
      return false
    }
  }

  async createContentType () {
    // const newType = await entryTypeModel.save(entryType, context.user.id)
  }

  /**
   * 创建新组织
   * @param orgName
   * @param user
   * @returns {Promise<{id: *}>}
   */
  async createOrg (orgName, user) {
    const orgModel = think.model('orgs');
    const orgId = await this.regElement(ElementType.org)
    // 新增类型注册成功后添加内容
    if (orgId !== false) {
      await orgModel.add({
        id: orgId,
        name: orgName,
        createdBy: user.id,
        updatedBy: user.id,
        createdAt: dateNow(),
        updatedAt: dateNow()
      })
      // 4 关联组织用户
      const role = 'owner'
      const usermeta = think.model('usermeta')
      await usermeta.add({
        userId: user.id,
        metaKey: `org_${orgId}_capabilities`,
        metaValue: JSON.stringify({'role': role, 'type': 'org'})
      })
      return {id: orgId}
    }
  }

  /**
   * 创建内容空间
   * @param spaceInput
   * @param user
   * @returns {Promise<*>}
   */
  async createSpace (spaceInput, user) {
    // createSpace: async (prev, args, context) => {
    const spaceModel = think.model('spaces');
    const userId = user.id
    // 验证组织 ID
    const orgModel = think.model('orgs')
    const originOrg = await orgModel.where({id: spaceInput.orgId}).field(['id']).find()
    if (think.isEmpty(originOrg) || spaceInput.orgId !== originOrg.id) {
      throw new Error('OrgId is not exists!')
    }
    const spaceId = await this.regElement(ElementType.space)
    await spaceModel.add({
      id: spaceId,
      name: spaceInput.name,
      orgId: spaceInput.orgId,
      status: 'pending',
      createdBy: user.id,
      updatedBy: user.id,
      createdAt: dateNow(),
      updatedAt: dateNow()
    })
    const db = think.service('fty', {spaceId: spaceId})
    const res = await db.create()
    if (think.isEmpty(res)) {
      // 记录用户 owner
      const spaceElementsModel = think.model('elements', {spaceId: spaceId})
      await spaceElementsModel.addMany([{
        id: userId,
        type: ElementType.user,
        createdAt: dateNow(),
        updatedAt: dateNow()
      }, {
        id: 'master',
        type: ElementType.env,
        createdAt: dateNow(),
        updatedAt: dateNow()
      }])
      // 创建环境
      const envModel = think.model('envs', {spaceId: spaceId})
      await envModel.add({
        id: 'master',
        spaceId: spaceId,
        // FAILURE
        // PENDING
        // READY
        status: 'ready',
        description: 'Master environment.'
      })

      // 更新空间状态
      await spaceModel.where({
        id: spaceId
      }).update({
        status: 'ready',
        updateAt: dateNow()
      })
    } else {
      return this.fail(res)
    }

    // 关联 space 用户
    const role = 'manager'
    const usermeta = think.model('usermeta')
    await usermeta.add({
      userId: userId,
      metaKey: `space_${spaceId}_capabilities`,
      metaValue: JSON.stringify({'role': role, 'type': 'space'})
    })

    const persistSpace = await spaceModel.where({id: spaceId}).find()
    return persistSpace
    // }
  }
}

