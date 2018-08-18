/* eslint-disable prefer-reflect,no-return-await,no-undef */
const BaseRest = require('../../base')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

module.exports = class extends BaseRest {

  async signupAction () {
    if (this.isPost) {

      // if 用户不存在进行注册
      const data = this.post()

      const userModel = think.model('users')
      const exist = await userModel.where({email: data.email}).find()
      if (exist) {
        return this.fail('UESR_EXIST')
      }

      // 1 注册元素类型
      const fty = think.service('fty')
      const userId = await fty.regElement(ElementType.user)
      const orgId = await fty.regElement(ElementType.user)
      const newUser = {
        id: userId,
        email: data.email,
        password: bcrypt.hashSync(data.password, 10),
        displayName: data.displayName,
        createdAt: dateNow(),
        updatedAt: dateNow()
      }
      // 2 添加用户
      await userModel.add(newUser)
      // 3 添加用户组织
      const orgModel = think.model('orgs')
      await orgModel.add({
        id: orgId,
        name: data.org,
        createdBy: userId,
        updatedBy: userId,
        createdAt: dateNow(),
        updatedAt: dateNow()
      })

      // 4 关联组织用户
      const role = 'owner'
      const usermeta = this.model('usermeta')
      await usermeta.add({
        userId: userId,
        metaKey: `org_${orgId}_capabilities`,
        metaValue: JSON.stringify({'role': role, 'type': 'org'})
      })
      return this.success(newUser.password)
      // const token = await think.service('auth_service').createToken(newUser.email, newUser.password)
    }
  }
  //
  // GET ACTIONS
  //
  async getAction () {
    const action = this.get('action')
    if (!think.isEmpty(action)) {
      switch (action) {
        case 'subdomain_validation': {
          const subdomain = this.get('subdomain')
          return await this.subdomainValidation(subdomain)
        }
        case 'shortid' : {
          return this.success(think.id.generate())
        }
        default: {
          return this.fail('非法请求！')
        }
      }
    }
    // const options = this.model('options')
    // const la = await options.get(true)
    // return this.success(la)
    if (!think.isEmpty(this.get('orgId'))) {
      return await this.orgInfo()
    }
  }

  async orgInfo () {
    try {
      let data = await this.model('orgs').where({[this.modelInstance.pk]: this.orgId}).find();
      for (let meta of data.metas) {
        if (meta.meta_key === 'basic') {
          data.basic = JSON.parse(meta.meta_value)
          data = Object.assign(data, data.basic)
          Reflect.deleteProperty(data, 'basic')
        }
      }
      delete data.metas;
      for (let app of data.apps) {
        if (!Object.is(app.metas, undefined)) {
          _formatOneMeta(app)
          app = Object.assign(app, app.meta.info)
          Reflect.deleteProperty(app, 'meta')
        }
      }
      return this.success(data);
    } catch (e) {
      return this.fail()
    }
  }

  /**
   * 验证机构名称 用于二级域名
   * @param subdomain
   * @returns {Promise.<*>}
   */
  // api/teams/subdomain_validation?subdomain=vanq
  async subdomainValidation (subdomain) {
    const orgs = await think.cache('orgs')
    const validation = await think._.has(orgs, subdomain)
    if (!validation) {
      return this.success()
    } else {
      return this.fail('名称已存在！')
    }
  }

  //
  // POST ACTIONs
  //
  async _format_Meta (posts) {
    const _items = [];

    for (const post of posts) {
      post.meta = {};
      if (post.metas.length > 0) {
        for (const meta of post.metas) {
          post.meta[meta.metaKey] = meta.metaValue;
        }
      }
      delete post.metas;
      _items.push(post);
    }
    return _items;
  }

  // async postAction () {
  //   const data = this.post()

  // 应用建设开通
  // const db = think.service('installApp', 'common', {appId: think.id.generate()})
  // await db.create()
  // }

  async postAction () {
    const action = this.get('action')
    switch (action) {
      case 'signin': {
        return await this.signin()
      }
      case 'signout': {
        return this.success('signin')
      }
      case 'signup': {
        return await this.signup()
      }
      default: {
        return this.fail('非法请求')
      }
    }
    // return this.success('org signing ...')
  }

  /**
   * 用户注册
   * @returns {Promise.<*>}
   */
  async signup () {
    // if 用户不存在进行注册

    // const action = this.get('action')
    // 机构开通
    const data = this.post()

    const userModel = think.model('users')
    const exist = await userModel.where({email: data.email}).find()
    if (exist) {
      return this.fail('USER_EXIST')
    }

    // 1 注册元素类型
    const fty = think.service('fty')
    const userId = await fty.regElement(ElementType.user)
    const orgId = await fty.regElement(ElementType.user)

    // 2 添加用户
    await userModel.add({
      id: userId,
      email: data.email,
      password: bcrypt.hashSync(data.password, 10),
      displayName: data.displayName,
      createdAt: dateNow(),
      updatedAt: dateNow()
    })
    // 3 添加用户组织
    const orgModel = think.model('orgs')
    await orgModel.add({
      id: orgId,
      name: data.org,
      createdBy: userId,
      updatedBy: userId,
      createdAt: dateNow(),
      updatedAt: dateNow()
    })

    // 4 关联组织用户
    const role = 'owner'
    const usermeta = this.model('usermeta')
    await usermeta.add({
      userId: userId,
      metaKey: `org_${orgId}_capabilities`,
      metaValue: JSON.stringify({'role': role, 'type': 'org'})
    })
    // 后续这里的用户简介可以处理与 resume 模型关联
    // if (!think.isEmpty(data.summary)) {
    //   await usermeta.save(res.id, {
    //     'resume': JSON.stringify({"summary": data.summary})
    //   })
    // }
    // if (!think.isEmpty(data.avatar)) {
    //   await usermeta.save(res.id, {
    //     'avatar': data.avatar
    //   })
    // }
    // await
    // await userModel.addOrgUser(data)
    // await userModel.add({})
    // const code = data.code
    // const identity = data.identity
    // 验证短信码是否合法，成功后销毁
    // const verify = await verifyMsgCode(identity, code, true)
    // if (verify) {
    //   // 获取 orgId
    //   try {
    //     // 1 Create Org
    //     const orgId = await this.model('orgs').add({
    //       subdomain: data.subdomain,
    //       create_time: new Date().getTime(),
    //       update_time: new Date().getTime()
    //     })
    //
    //     const orgs = await think.model('orgs').get()
    //     await think.cache('orgs', JSON.stringify(orgs))
    //
    //     // 2 Create Org Table
    //     // const db = this.service('orginit', {orgId: orgId})
    //     // const error = await db.create()
    //     // if (think.isEmpty(error)) {
    //     // 3 Create Org Administrator
    //     const userModel = think.model('users')
    //     // 添加机构用户
    //     await userModel.addOrgUser({
    //       org_id: orgId,
    //       user_login: data.user_login,
    //       user_nicename: data.user_nicename ? data.user_nicename : data.user_login,
    //       user_pass: data.user_pass,
    //       user_email: data.user_email,
    //       user_phone: data.user_phone,
    //       role: 'Adminstrator'
    //     })
    //     // }
    //
    //     // 4 Register Org Meta
    //     const metaModel = think.model('orgmeta')
    //     await metaModel.add({
    //       org_id: orgId,
    //       meta_key: 'basic',
    //       meta_value: JSON.stringify({
    //         name: data.org_name,
    //         plan: 'basic',
    //         logo_url: '',
    //         subdomain: data.subdomain,
    //         description: data.description
    //       })
    //     })
    //
    //     // 5 Registration log
    //     const logModel = think.model('registration_log')
    //     await logModel.add({
    //       user_email: data.user_email,
    //       user_phone: data.user_phone,
    //       created: new Date().getTime(),
    //       org_id: orgId,
    //       ip: _ip2int(this.ip)
    //     })
    //
    //     return this.success(data.subdomain)
    //   } catch (e) {
    //     think.logger.error(e)
    //     return this.fail(e)
    //   }
    // }

  }

  /**
   * 登录
   * @returns {Promise.<*>}
   */
  async signin () {
    const data = this.post()
    if (think.isEmpty(data.email)) {
      return this.fail('邮户邮箱不能为空');
    }
    const userLogin = data.email;

    const userModel = this.model('users');
    const userInfo = await userModel.where({email: userLogin}).find();
    // 验证用户是否存在
    if (think.isEmpty(userInfo)) {
      return this.fail(404, 'ACCOUNT_NOT_FOUND');
    }
    // 验证机构中是否存在此用户并处理用户角色权限
    _formatOneMeta(userInfo)
    if (!think.isEmpty(userInfo.meta.avatar)) {
      userInfo.avatar = await this.model('postmeta').getAttachment('file', userInfo.meta.avatar)
    }
    // 帐号是否被禁用，且投稿者不允许登录
    if ((userInfo.user_status | 0) !== 1 || userInfo.deleted === 1) {
      return this.fail('ACCOUNT_FORBIDDEN');
    }

    // 校验密码
    const password = data.user_pass;
    if (!userModel.checkPassword(userInfo, password)) {
      return this.fail(400, 'ACCOUNT_PASSWORD_ERROR');
    }
    // return this.success(userInfo)
    // 获取签名盐
    const token = await jwt.sign({userInfo}, 'S1BNbRp2b', {expiresIn: '3d'})
    // user: userInfo.user_login,
    // let validity_days = 7;
    // let expires = validity_days * 1000 * 60 * 60 * 24;
    // const user = jwt.verify();
    // const user = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJpZCI6MTUsInVzZXJfbG9naW4iOiJhZG1pbiIsInVzZXJfcGFzcyI6IiQyYSQwOCRybDFpb29TMHN3YW1uck1jL0dtU3VlTTh0MWRXdzB1bjdMaHhCdzkxRnRsNUNldG9iZVAzYSIsInVzZXJfbmljZW5hbWUiOiLnrqHnkIblkZgiLCJ1c2VyX2VtYWlsIjoiYmFpc2hlbmdAb3V0bG9vay5jb20iLCJ1c2VyX3VybCI6bnVsbCwidXNlcl9yZWdpc3RlcmVkIjoxNTAzODEwMzIwOTk2LCJ1c2VyX2FjdGl2YXRpb25fa2V5IjpudWxsLCJ1c2VyX3N0YXR1cyI6MSwiZGlzcGxheV9uYW1lIjpudWxsLCJzcGFtIjowLCJkZWxldGVkIjowLCJ1c2VyX3Bob25lIjpudWxsLCJtZXRhIjp7InBpY2tlcl8xX2NhcGFiaWxpdGllcyI6eyJyb2xlIjoiZWRpdG9yIn0sIm9yZ18xX2NhcGFiaWxpdGllcyI6eyJyb2xlIjoiYWRtaW4ifSwicGlja2VyXzFfd3hhcHAiOiIxIiwiYXZhdGFyIjoiMjMifSwiYXZhdGFyIjoiaHR0cDovL2RhdGEucGlja2VyLmNjL3VwbG9hZF82OGMwYjM5MjcxNzViNjIyN2EyMmQ2NjIxYjY2YjBjOS5qcGciLCJyb2xlIjoiYWRtaW4ifSwiaWF0IjoxNTA3ODgzMjM1LCJleHAiOjE1MDgxNDI0MzV9.CfdEENtA_NW6vLmZdNnpaUZf3eHJMC7hKiHTfxLv1Xc', 'S1BNbRp2b');
    // return this.success(user)
    // return this.success({user: userInfo.user_login, token: {value: token, expires: 3}});
    return this.success({user: userInfo.login, token: token});
    // return this.success({user: userInfo.user_login, token: {value: token, expires: 3}});
    // }
  }

}
