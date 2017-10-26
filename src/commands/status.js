const Commom = require('./commom')

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

    let hits
    try {
      hits = await this.getAhgoraHits()
    } catch (err) {
      console.log('Error:', err)
      throw new Error(err)
    }

    const mount = this.mountInteractions(entries.normalize, hits.normalize)

    const status = mount.reduce((accumulator, currentValue) => {
      /* eslint-disable camelcase */
      return accumulator.concat({
        description: currentValue.description,
        started_at: currentValue.started_at,
        finished_at: currentValue.finished_at
      })
      /* eslint-disable camelcase */
    }, [])

    console.log(JSON.stringify(status, null, 2))
  }

  help() {
    /* eslint-disable no-multi-spaces */
    const help =  '\nUsage:\n' +
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
