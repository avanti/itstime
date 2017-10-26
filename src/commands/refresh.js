const Bootstrap = require('../libs/bootstrap')

class Refresh {
  constructor(args) {
    this.args = args
    this.bootstrap = new Bootstrap()

    if (args.help === true) {
      this.help()
    } else {
      this.start()
    }
  }

  start() {
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

  help() {
    /* eslint-disable no-multi-spaces */
    const help =  '\nUsage:\n' +
                  '  \x1b[36mitstime\x1b[0m refresh [<options>] [newValue]\n\n' +

                  'Options:\n' +
                  '  \x1b[33m--ahgora_id\n' +
                  '  --ahgora_userId\n' +
                  '  --ahgora_password\n' +
                  '  --jobber_userId\n' +
                  '  --jobber_token\n' +
                  '  --toggl_token\n' +
                  '  --toggl_workspaceId\x1b[0m\n'
    /* eslint-disable no-multi-spaces */

    console.log(help)
  }
}

module.exports = Refresh
