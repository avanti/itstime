const Commom = require('./commom')

class Status extends Commom {
  constructor(args) {
    super(args)

    this.start()
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
}

module.exports = Status
