/* eslint-disable no-undef,no-return-assign,prefer-reflect,prefer-rest-params */
const moment = require('moment');
moment.locale('zh-cn');
const pagination = require('think-pagination');
const jsonwebtoken = require('jsonwebtoken');

module.exports = {
  authFail () {
    return this.fail('JWT 验证失败')
  },

  checkAuth (target, name, descriptor) {
    const action = descriptor.value;
    descriptor.value = function () {
      console.log(this.ctx.state.user)
      const userName = this.ctx.state.user && this.ctx.state.user.name
      if (!userName) {
        return this.authFail()
      }
      this.updateAuth(userName)
      return action.apply(this, arguments)
    }

    return descriptor
  },

  updateAuth(userName) {
    const userInfo = {
      name: userName
    }
    const {secret, cookie, expire} = this.config('jwt')
    const token = jsonwebtoken.sign(userInfo, secret, {expiresIn: expire})
    this.cookie(cookie, token)
    return token
  },
  // success (...args) {
  //   this.ctx.success(...args)
  //   return think.prevent()
  // },
  // fail (...args) {
  //   this.ctx.fail(...args)
  //   return think.prevent()
  // },
  get isMobile () {
    return this.ctx.isMobile;
  },
  moment: moment,
  mtpl (action = this.ctx.action) {
    const c = this.ctx.controller.split('/');
    c.splice((this.ctx.controller.split('/').length - 1), 0, 'mobile');
    return temp = `${c.join("/")}_${action}`;
  },
  para (param) {

    return this.get(param) || this.post(param)
  },
  pagination (data, config = {}) {
    const ops = think.extend({
      desc: true, // show description
      pageNum: 2,
      url: '', // page url, when not set, it will auto generated
      class: 'nomargin', // pagenation extra class
      text: {
        next: '下一页',
        prev: '上一页',
        total: '总数: __COUNT__ , 页数: __PAGE__'
      }
    }, config);
    return pagination(data, this.ctx, ops);
  },
  get isweixin () {
    let flag = false;
    const agent = this.userAgent.toLowerCase();
    // let key = ["mqqbrowser","micromessenger"];
    const key = ["micromessenger"];
    // 排除 Windows 桌面系统
    if (!(agent.indexOf("windows nt") > -1) || (agent.indexOf("windows nt") > -1 && agent.indexOf("compatible; msie 9.0;") > -1)) {
      // 排除苹果桌面系统
      if (!(agent.indexOf("windows nt") > -1) && !agent.indexOf("macintosh") > -1) {
        for (const item of key) {
          if (agent.indexOf(item) > -1) {
            flag = true;
            break;
          }
        }
      }
    }
    return flag;
  }
}
