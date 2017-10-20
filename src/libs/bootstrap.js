const fs = require('fs')
const beautify = require('json-beautify')

const config = require('../config/')

class Bootstrap {
  async config() {
    try {
      return await this.content()
    } catch (err) {
      console.log(err)
    }
  }

  getContent() {
    return new Promise((resolve, reject) => {
      fs.readFile(config.dotFile, 'utf8', (err, data) => {
        if (err) {
          reject(err)
        }

        resolve(JSON.parse(data))
      })
    })
  }

  setContent(content) {
    return new Promise((resolve, reject) => {
      const data = beautify(content, null, 2, 100)

      fs.writeFile(config.dotFile, data, err => {
        if (err) {
          reject(err)
        }

        resolve(true)
      })
    })
  }
}

module.exports = Bootstrap
