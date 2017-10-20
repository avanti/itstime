const Bootstrap = require('../libs/bootstrap')

class Refresh {
  constructor(args) {
    this.args = args
    this.bootstrap = new Bootstrap()

    this.getDotFile()
  }

  async getDotFile() {
    try {
      this.config = await this.bootstrap.getContent()
      this.setArgs(this.args)
    } catch (err) {
      console.log(err)
    }
  }

  async setArgs(args) {
    for (const item in args) {
      if (item !== '_') {
        this.config[item] = String(args[item])
      }
    }

    try {
      await this.bootstrap.setContent(this.config)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = Refresh
