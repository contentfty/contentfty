module.exports = class extends think.Logic {
  signupAction () {
    let rules = {
      email: {
        email: true,
        required: true
      },
      org: {
        required: true
      },
      password: {
        required: true,
        trim: true,
        length: {min: 8}
      }
    }
    let flag = this.validate(rules)
    if (!flag) {
      return this.fail('validate error', this.validateErrors);
    }
  }
  signinAction () {
    let rules = {
      email: {
        email: true,
        required: true
      },
      password: {
        required: true
      }
    }
    let flag = this.validate(rules)
    if (!flag) {
      return this.fail('validate error', this.validateErrors);
    }
  }
};
