class Itstime {
  constructor(args) {
    this.args = args
    this.cmd = args._[0]
    this.command()
  }

  command() {
    const Module = require(`./commands/${this.cmd}`)

    return new Module(this.args)
  }
}

module.exports = Itstime
