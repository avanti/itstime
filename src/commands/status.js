const Commom = require('./common')

class Status extends Commom {
  constructor(args) {
    super(args)

    if (args.help === true) {
      this.help()
    } else {
      this.start()
    }
  }

  async start() {
    this.config = await this.setConfig()

    let entries
    try {
      entries = await this.getTogglEntries()
    } catch (err) {
      console.log('Error:', err)
      throw new Error(err)
    }

    const mount = this.mountInteractions(entries.normalize)

    const status = mount.reduce((accumulator, currentValue) => {
      /* eslint-disable camelcase */
      return accumulator.concat({
        id: currentValue.IDTarefa,
        started_at: currentValue.Inicio,
        finished_at: currentValue.Fim,
      })
      /* eslint-disable camelcase */
    }, [])

    console.log(JSON.stringify(status, null, 2))
  }

  help() {
    /* eslint-disable no-multi-spaces */
    const help =
      '\nUsage:\n' +
      '  \x1b[36mitstime\x1b[0m status <command>\n\n' +
      'Commands:\n' +
      '  today           Return status of today\n' +
      '  yesterday       Return status of yesterday\n' +
      '  <date>          Return status of a date <2017-06-29>\n'
    /* eslint-disable no-multi-spaces */

    console.log(help)
  }
}

module.exports = Status
