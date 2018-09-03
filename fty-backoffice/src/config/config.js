// const isDev = think.env === 'development'
const fs = require('fs')
let port;
const portFile = think.ROOT_PATH + '/port'
if (think.isFile(portFile)) {
  port = fs.readFileSync(portFile, 'utf8')
}
// default config
module.exports = {
  workers: 1,
  host: '0.0.0.0',
  port: port || 8360
}
