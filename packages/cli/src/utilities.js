const fs = require('fs.promised')
const ejs = require('ejs')
const path = require('path')
const shell = require('shelljs')
const changeCase = require('change-case')
const Configstore = require('configstore')

const { ACTION_PATH, TEMPLATES_PATH, STORE_NAME } = require('./constants')

const store = new Configstore(STORE_NAME, { token: null })

const getToken = function(noError) {
  let token = process.env.TIPE_TOKEN
  if (!token) {
    try {
      const conf = store.get('token')
      token = conf.token
    } catch (e) {
      token = null
    }
  }
  if (!noError && !token) {
    throw new Error(
      'use "fty login" or environment variable FTY_TOKEN needs to be set.'
    )
  }
  return token
}

const renderFile = async function(fileName, ctx) {
  const file = await fs.readFile(fileName)
  return ejs.render(file.toString(), ctx)
}

const writeFile = async function(path, file) {
  await fs.writeFile(path, file)
}

const recursiveStat = async function(
  currentPath,
  visitor,
  tempPath,
  ignorePaths
) {
  ignorePaths = ignorePaths || /node_modules|\.nuxt|dist|\.DS_Store|\.env/
  const files = await fs.readdir(currentPath)
  // visit each file in a directory
  const recursiveResolve = files
    .filter(fileName => ignorePaths.test(fileName) === false)
    .map(async fileName => {
      const currentFile = path.join(currentPath, fileName)
      const stat = await fs.stat(currentFile)
      const relativePath = path.relative(
        tempPath || TEMPLATES_PATH,
        currentPath
      )

      if (stat.isFile()) {
        return visitor(currentFile, relativePath, fileName)
      }
      if (stat.isDirectory()) {
        return recursiveStat(currentFile, visitor, tempPath, ignorePaths)
      }
    })
  const fileContents = await Promise.all(recursiveResolve)
  return fileContents
}

const getActionFilePaths = async function() {
  const actions = await fs.readdir(ACTION_PATH)
  const ignorePaths = /node_modules|\.nuxt|dist|\.DS_Store|\.env|\.md|_example_/
  return actions
    .filter(fileName => ignorePaths.test(fileName) === false)
    .map(filename => path.join(ACTION_PATH, filename))
}

const filenameReplacer = function(str, ctx) {
  return str.replace(/__([^____]*)__/g, (a, b) => {
    const r = ctx[b]
    return typeof r === 'string' || typeof r === 'number' ? r : a
  })
}

const ensureDir = function(filepath) {
  // must be sync to prevent parallel creates
  try {
    if (fs.existsSync(filepath) === false) {
      shell.mkdir('-p', filepath)
    }
    return true
  } catch (e) {
    return false
  }
}

const validatePort = function(port) {
  const converted = Number(port)
  if (Number.isNaN(converted)) {
    return
  }
  return converted
}

const createCase = function(str) {
  return {
    pascalCase: changeCase.pascalCase(str),
    camelCase: changeCase.camelCase(str),
    constantCase: changeCase.constantCase(str),
    dotCase: changeCase.dotCase(str),
    headerCase: changeCase.headerCase(str),
    lowerCase: changeCase.lowerCase(str),
    paramCase: changeCase.paramCase(str),
    pathCase: changeCase.pathCase(str),
    snakeCase: changeCase.snakeCase(str),
    sentenceCase: changeCase.sentenceCase(str),
    titleCase: changeCase.titleCase(str),
    upperCase: changeCase.upperCase(str),
    upperCaseFirst: changeCase.upperCaseFirst(str)
  }
}

const createContext = function(obj) {
  return {
    ...obj
  }
}

const createConfig = function(options) {
  let CURRENT_DIR = process.cwd()

  if (options.root) {
    CURRENT_DIR = path.join(process.cwd(), options.root)
  }

  return {
    ...options,
    root: CURRENT_DIR
  }
}

const copyBoilerplateFile = async function(
  designatedDir,
  fileName,
  fileContent
) {
  const resolvedPath = path.join(designatedDir, fileName)
  await writeFile(resolvedPath, fileContent)
}

const createBoilerplate = async function(root, fileName, directory, CTX) {
  /* Template Directory */
  // path where template file lives
  const templateFilePath = path.join(TEMPLATES_PATH, directory, fileName)
  // get the file content for writing
  const fileContent = await renderFile(templateFilePath, CTX)

  /* User Directory */
  // directory where file will be copied
  let designatedDir = path.join(root, directory)
  if (CTX.subDirectory) {
    console.log('in here?')
    designatedDir = path.join(root, directory, CTX.subDirectory)
  }
  // ensure the directory exists
  ensureDir(designatedDir)
  // replace template filename with user's filename
  const newname = filenameReplacer(fileName, CTX)
  await copyBoilerplateFile(designatedDir, newname, fileContent)
}

const createBoilerplateFactory = function(directory, fileName) {
  return (root, CTX) => {
    return createBoilerplate(root, fileName, directory, CTX)
  }
}

module.exports = {
  store,
  getToken,
  renderFile,
  writeFile,
  recursiveStat,
  getActionFilePaths,
  ensureDir,
  filenameReplacer,
  validatePort,
  createCase,
  createContext,
  createConfig,
  copyBoilerplateFile,
  createBoilerplateFactory
}
