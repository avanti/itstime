const axios = require('axios')

const Commom = require('./commom')

class Up extends Commom {
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

    const jobs = this.mountInteractions(entries.normalize, hits.normalize)

    await this.up(jobs)
  }

  async up(jobs) {
    const jobberUrl = 'http://jobber-api.eavanti.com.br/api/v1/interactions'

    jobs.map(async currentValue => {
      try {
        const job = await axios.post(jobberUrl, currentValue, {
          headers: {
            Authorization: `Bearer ${this.config.jobber_token}`
          }
        })

        const response = {
          start: job.data.interaction.started_at,
          end: job.data.interaction.finished_at,
          description: job.data.interaction.description
        }

        console.log('Done!')
        console.log(JSON.stringify(response, null, 2))
        console.log('\n')

        return response
      } catch (err) {
        console.error('Error: On up jobs.', err.response.data.error)
        throw new Error(err)
      }
    })
  }
}

module.exports = Up
