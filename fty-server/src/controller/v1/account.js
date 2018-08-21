/* eslint-disable no-undef */
const BaseRest = require('../base')

module.exports = class extends BaseRest {
  /**
   * 用户登录
   * @returns {Promise<void>}
   */
  async signinAction () {
    const data = this.post()
    const userLogin = data.email;

    const userModel = this.model('users');
    const userInfo = await userModel.where({email: userLogin}).find();
    // 验证用户是否存在
    if (think.isEmpty(userInfo)) {
      return this.fail(404, 'ACCOUNT_NOT_FOUND');
    }
    // 帐号是否被禁用
    if (userInfo.deleted === 1) {
      return this.fail('ACCOUNT_FORBIDDEN');
    }

    // 校验密码
    if (!userModel.checkPassword(userInfo.password, data.password)) {
      return this.fail(400, 'ACCOUNT_PASSWORD_ERROR');
    }
    const token = await think.service('authService').generateToken({
      id: userInfo.id
      // email: userInfo.email,
      // displayName: userInfo.display_name
    })
    return this.success(token)
  }
  /**
   * 用户注册
   * @returns {Promise<*>}
   */
  async signupAction () {
    if (this.isPost) {
      // if 用户不存在进行注册
      const data = this.post()

      const userModel = think.model('users')
      const exist = await userModel.where({email: data.email}).find()
      if (!think.isEmpty(exist)) {
        return this.fail('USER_EXIST')
      }

      // 1 注册元素类型
      const fty = think.service('fty')
      const userId = await fty.regElement(ElementType.user)
      const orgId = await fty.regElement(ElementType.user)

      const newUser = {
        id: userId,
        email: data.email,
        password: userModel.getEncryptPassword(data.password),
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
      // return this.success(newUser.password)
      const token = await think.service('authService').generateToken({
        id: userId,
        email: newUser.email,
        displayName: newUser.display_name
      })
      return this.success(token)
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
}
