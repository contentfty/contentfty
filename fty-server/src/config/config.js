// const isDev = think.env === 'development'
const fs = require('fs')
const path = require('path')

let port;
const portFile = think.ROOT_PATH + 'port'
if (think.isFile(portFile)) {
  port = fs.readFileSync(portFile, 'utf8')
}
let host
const hostFile = path.join(think.ROOT_PATH, 'host')
if (think.isFile(hostFile)) {
  host = fs.readFileSync(hostFile, 'utf8')
}
// default config
module.exports = {
  workers: 1,
  host: '0.0.0.0',
  port: port || 5000,
  jwt: {
    secret: 'content-factory-2018',
    cookie: 'jwt-token',
    expire: 30 // 秒
  }
}

// module.exports = {
//   workers: 1,
//   host: host || process.env.HOST || '0.0.0.0',
//   port: port || process.env.PORT || 5000,
  /** disable theme editor */
  // DISALLOW_FILE_EDIT: process.env.DISALLOW_FILE_EDIT || false
// }
