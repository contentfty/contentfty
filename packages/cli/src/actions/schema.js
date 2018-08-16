// const fs = require('fs.promised')
// const path = require('path')
const program = require('commander')

// const {} = require('../utilities')
// const {} = require('../constants')

const action = async function(name) {
  // const CURRENT_DIR = process.cwd()

  console.log('hello world schema')
}

program
  .command('schema')
  .alias('s')
  .action(action)
