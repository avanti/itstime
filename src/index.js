class Itstime {
  constructor(args) {
    this.args = args
    this.cmd = args._[0]
    this.command()
  }

  command() {
    let Module

    if (typeof this.cmd !== 'undefined') {
      Module = require(`./commands/${this.cmd}`)
    }

    if (this._isHelp()) {
      Module = require(`./commands/help`)
    }

    return new Module(this.args)
  }

  _isHelp() {
    return (
      this.args._.length < 1 && (this.args.help === true || this.args.h === true)
    )
  }
}

module.exports = Itstime
