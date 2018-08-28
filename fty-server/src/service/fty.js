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
  constructor(config) {
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
  async create() {
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

  async init() {
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
  async regElement(type) {
    const elementModel = think.model('elements', { spaceId: this.spaceId })
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

  /**
   * 保存内容类型(创建内容类型 and 更新内容类型)
   * @returns {Promise<*>}
   */
  async saveEntryType(entrytypeInput, user, spaceId) {
    if (think.isEmpty(entrytypeInput.id)) {
      const entryTypeModel = think.model('entrytypes', { spaceId: spaceId })
      const entrytypeExists = await entryTypeModel.where({ name: entrytypeInput.name }).find();
      if (!think.isEmpty(entrytypeExists)) {
        throw new Error(`${entrytypeInput.name} already exists!`)
      }

      const saveParams = {
        id: Generate.id(),
        name: entrytypeInput.name,
        fields: JSON.stringify([]),
        createdBy: user.id,
        updatedBy: user.id,
        createdAt: dateNow(),
        updatedAt: dateNow()
      }
      await entryTypeModel.add(saveParams)
      return saveParams
    } else {
      const entryTypeModel = think.model('entrytypes', { spaceId: spaceId })
      const entrytypeExists = await entryTypeModel.where({ id: entrytypeInput.id }).find()
      if (think.isEmpty(entrytypeExists)) {
        throw new Error('Entry Type does not exists!')
      }
      entrytypeInput.updatedAt = dateNow()
      const affectedRows = await entryTypeModel.where({ id: entrytypeInput.id }).update(entrytypeInput)
      if (affectedRows > 0) {
        return await entryTypeModel.where({ id: entrytypeInput.id }).find()
      }
      throw new Error('Entry Type update failed!')
    }
  }

  /**
   * 保存组织(创建新组织 and 更新组织)
   * @param data  {id,name}
   * @param user
   * @returns {Promise<{id: *}>}
   */
  async saveOrg(orgInput, user) {
    if (think.isEmpty(orgInput.id)) {
      const orgModel = think.model('orgs');
      const orgId = await this.regElement(ElementType.org)
      // 新增类型注册成功后添加内容
      if (orgId !== false) {
        await orgModel.add({
          id: orgId,
          name: orgInput.name,
          createdBy: user.id,
          updatedBy: user.id,
          createdAt: dateNow(),
          updatedAt: dateNow()
        })
        // 关联组织用户
        const role = 'owner'
        const usermetaModel = think.model('usermeta')
        await usermetaModel.add({
          userId: user.id,
          metaKey: `org_${orgId}_capabilities`,
          metaValue: JSON.stringify({ 'role': role, 'type': 'org' })
        })
        return { id: orgId }
      } else {
        return this.fail('Organization creation failed!')
      }
    } else {
      const orgModel = think.model('orgs');
      const orgExists = await orgModel.where({ id: orgInput.id }).find();
      if (think.isEmpty(orgExists)) {
        throw new Error('Organization does not exists!')
      }
      orgInput.updatedAt = dateNow()
      const affectedRows = await orgModel.where({ id: orgInput.id }).update(orgInput)
      if (affectedRows > 0) {
        return await orgModel.where({ id: orgInput.id }).find()
      } else {
        return this.fail('Organization update failed!')
      }
    }
  }

  /**
   * 保存空间(创建内容空间 and 更新空间)
   * @param spaceInput
   * @param user
   * @returns {Promise<*>}
   */
  async saveSpace(spaceInput, user) {
    if (think.isEmpty(spaceInput.id)) {
      const spaceModel = think.model('spaces');
      // 验证组织 ID
      const orgModel = think.model('orgs')
      const orgExists = await orgModel.where({ id: spaceInput.orgId }).field(['id']).find()
      if (think.isEmpty(orgExists)) {
        throw new Error('Organization does not exists!')
      }

      // 注册元素 
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

      //生成空间表结构
      const db = think.service('fty', { spaceId: spaceId })
      const res = await db.create()
      if (think.isEmpty(res)) {
        // 记录用户 owner
        const spaceElementsModel = think.model('elements', { spaceId: spaceId })
        await spaceElementsModel.addMany([{
          id: user.id,
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
        const envModel = think.model('envs', { spaceId: spaceId })
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
      const usermetaModel = think.model('usermeta')
      await usermetaModel.add({
        userId: user.id,
        metaKey: `space_${spaceId}_capabilities`,
        metaValue: JSON.stringify({ 'role': role, 'type': 'space' })
      })

      const persistSpace = await spaceModel.where({ id: spaceId }).find()
      return persistSpace
    } else {
      const spaceModel = think.model('spaces');
      const spaceExists = await spaceModel.where({ id: spaceInput.id }).find();
      if (think.isEmpty(spaceExists)) {
        throw new Error('Space does not exists!')
      }
      const affectedRows = await spaceModel.where({ id: spaceInput.id }).update({
        name: spaceInput.name,
        updatedAt: dateNow()
      })
      if (affectedRows > 0) {
        return await spaceModel.where({ id: spaceInput.id }).find()
      } else {
        return this.fail('Space update failed!')
      }
    }
  }

  /**
   * 保存用户 (创建新用户 and 更新用户)
   * 一般情况都由 Controller 中的 signup 注册用户
   * 此处为系统平台的创建功能
   * @param userInput
   * @returns {Promise<*>}
   */
  async saveUser(userInput) {
    if (think.isEmpty(userInput.id)) {  // 创建新用户
      /*
        1. 注册进 elements (添加user类型，添加org类型)
        2. add user
        3. add org
        4. add usermeta 关联组织用户
      */
      const userId = Generate.id()
      const orgId = Generate.id()

      const elementsModel = think.model('elements')
      const userModel = think.model('users')
      const orgModel = think.model('orgs')

      const insertIds = await elementsModel.addMany([
        { id: userId, type: think.elementType.user, createdAt: dateNow(), updatedAt: dateNow() },
        { id: orgId, type: think.elementType.org, createdAt: dateNow(), updatedAt: dateNow() },
      ])

      if (insertIds.length === 2) {
        // add user
        await userModel.add({
          id: userId,
          login: userInput.email,
          email: userInput.email,
          password: userModel.getEncryptPassword(userInput.password),
          displayName: userInput.displayName,
          phone: userInput.phone,
          createdAt: dateNow(),
          updatedAt: dateNow()
        })

        // add org
        await orgModel.add({
          id: orgId,
          name: slugName(userInput.org),
          createdBy: userId,
          updatedBy: userId,
          createdAt: dateNow(),
          updatedAt: dateNow()
        })

        const role = 'owner'
        const usermetaModel = think.model('usermeta')
        await usermetaModel.add({
          userId: userId,
          metaKey: `org_${orgId}_capabilities`,
          metaValue: JSON.stringify({ 'role': role, 'type': 'org' })
        })

        const token = await think.service('authService').generateToken({
          id: userId,
          email: userInput.email,
          displayName: userInput.displayName
        })
        return { token: token }
      } else {
        return this.fail('User registration failed!')
      }
    } else {  //编辑用户
      if (!think.isEmpty(userInput.password)) {
        delete userInput['password']    //password 属性需要单独更新
      }
      const userModel = think.model('users')
      const userExists = await userModel.where({ id: userInput.id }).find()
      if (think.isEmpty(userExists)) {
        throw new Error('User does not exists!')
      }
      userInput.updatedAt = dateNow()
      const affectedRows = await userModel.where({ id: userInput.id }).update(userInput)
      if (affectedRows > 0) {
        return { id: userExists.id }
      } else {
        return this.fail('User update failed!')
      }
    }
  }

  /**
   * 保存字段(创建内容类型字段 and 更新内容类型字段)
   *
   * @param fieldInput
   * @param spaceId
   * @returns {Promise<any>}
   */
  async saveField(fieldInput, spaceId) {
    //name 和 typeId 作为联合唯一  , 但name允许被修改，根据id来处理
    if (think.isEmpty(fieldInput.id)) {
      const entrytypeModel = think.model('entrytypes', { spaceId: spaceId })

      //判断内容类型存在
      const entrytypeExists = await entrytypeModel.where({ id: fieldInput.typeId }).find()
      if (think.isEmpty(entrytypeExists)) {
        throw new Error('Entry Type does not exists!')
      }

      const fieldModel = think.model('fields', { spaceId: spaceId })
      const fieldExists = await fieldModel.where({ name: fieldInput.name, typeId: fieldInput.typeId }).find()
      if (!think.isEmpty(fieldExists)) {
        throw new Error(`${fieldInput.name} already exists!`)
      }
      const id = Generate.id()
      await fieldModel.add({
        id: id,
        typeId: fieldInput.typeId,
        name: fieldInput.name,
        title: fieldInput.title,
        type: fieldInput.type,
        instructions: fieldInput.instructions,
        unique: fieldInput.unique,
        required: fieldInput.required,
        disabled: fieldInput.disabled,
        validations: fieldInput.validations,
        settings: fieldInput.settings,
        createdAt: dateNow(),
        updatedAt: dateNow()
      })
      // 更新内容类型
      await entrytypeModel.where({
        id: fieldInput.typeId
      }).update({
        'fields': ['exp', `JSON_ARRAY_APPEND(fields, '$', '${id}')`]
      })
      return await fieldModel.where({ id: id }).find()
    } else {
      if (think.isEmpty(fieldInput.name)) {
        throw new Error('name does not exists!')
      }
      if (think.isEmpty(fieldInput.typeId)) {
        throw new Error('typeId does not exists!')
      }

      //判断内容类型存在
      const entrytypeModel = think.model('entrytypes', { spaceId: spaceId })
      const entrytypeExists = await entrytypeModel.where({ id: fieldInput.typeId }).find()
      if (think.isEmpty(entrytypeExists)) {
        throw new Error('Entry Type does not exists!')
      }

      const fieldModel = think.model('fields', { spaceId: spaceId })
      //检测新修改的name和typeId组合是否已经存在
      const exists = await fieldModel.where({ name: fieldInput.name, typeId: fieldInput.typeId }).find()
      if (!think.isEmpty(exists)) {
        throw new Error(`${fieldInput.name} already exists!`)
      }

      //判断字段存在
      const fieldExists = await fieldModel.where({ id: fieldInput.id }).find()
      if (think.isEmpty(fieldExists)) {
        throw new Error('Field does not exists!')
      }

      if (fieldInput.typeId !== fieldExists.typeId) {
        throw new Error('typeId does not match!')
      }

      fieldInput.updatedAt = dateNow()
      await fieldModel.where({ id: fieldInput.id }).update(fieldInput)

      return await fieldModel.where({ id: fieldInput.id }).find()
    }
  }

  /**
   * 保存内容条目 (创建内容条目 and 更新内容条目)
   * @param {*} entryInput 
   * @param {*} user 
   * @param {*} spaceId 
   */
  async saveEntry(entryInput, user, spaceId) {
    if (think.isEmpty(entryInput.id)) {
      //entry id
      const id = await think.service('fty').regElement(ElementType.entry)
      // data
      // const data = {
      //   "title": {
      //     "zh-CN": "这是一本好书"
      //   },
      //   "content": {
      //     "zh-CN": "这是一本好书"
      //   }
      // }
      // 检测内容类型存在
      const entrytypeModel = await think.model('entrytypes', { spaceId: spaceId })
      const entrytypeExists = await entrytypeModel.where({ id: entryInput.typeId }).find()
      if (think.isEmpty(entrytypeExists)) {
        throw new Error('Entry Type does not exists!')
      }

      const entryModel = await think.model('entries', { spaceId: spaceId })

      // 新增  第一个参数为要添加的数据，第二个参数为添加的条件，根据第二个参数的条件查询无相关记录时才会添加
      await entryModel.thenAdd({
        id: id,
        typeId: entryInput.typeId,
        createdBy: user.id,
        postDate: dateNow(),
        createdAt: dateNow(),
        updatedAt: dateNow()
      }, { id: id })

      const type = 'version'  //TODO 默认保存在版本中 (后续需要修改)
      // 保存至草稿
      if (type === 'draft') {
        //const draftModel = think.getModel('entrydrafts')
      } else {
        // 保存版本
        const versionModel = await think.model('entryversions', { spaceId: spaceId })
        //获取字段的最大值
        const maxNum = await versionModel.where({ entryId: id }).max('num')

        await versionModel.add({
          entryId: id,
          num: maxNum ? maxNum + 1 : 1,
          fields: JSON.stringify(entryInput.fields),
          createdBy: user.id,
          createdAt: dateNow(),
          updatedAt: dateNow()
        })
      }
      return { id: id }
    }else{  // todo 

    }
  }
}

