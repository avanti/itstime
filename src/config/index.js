const homedir = require('os').homedir()

const config = {
  homedir,
  dotFile: `${homedir}/.itstime`
}

module.exports = config
