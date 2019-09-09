const axios = require('axios')

const Common = require('./common')

const TATICO_REQUEST_HEADERS = {
  App: '7DE19B1B-BAB5-4D46-A861-729AA8DFFB19',
  cn: 'avanti2740',
  Hash:
    'R4KEQEqAQIA6gH6ARTpEgkRGOn5JRkA6R0FKfn5JgoWFgEBKgIWARUlCfkc6R0R+gDpEgoVKOoBKQkU6gYCBPkqERoWFgn6Efpp+j5eJQUdEPkFC',
  IDUsr: 23,
  Usr: 'bfb583a7-74ab-4df9-b935-cbc09e6ffdae',
  'Content-Type': 'application/json',
}

class Up extends Common {
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

    const jobs = this.mountInteractions(entries.normalize)

    await this.up(jobs)
  }

  async up(jobs) {
    const taticoUrl = 'https://api.tatico.net/api/tarefa/tempo'
    let jobsPromises = []

    jobs.map(async currentValue => {
      jobsPromises.push(
        new Promise(async (resolve, reject) => {
          try {
            const raw = await axios.post(taticoUrl, currentValue, {
              headers: TATICO_REQUEST_HEADERS,
            })

            if (raw && raw.status == 200) {
              resolve(raw)
            }
            reject()
          } catch (error) {
            throw new Error(error)
          }
        })
      )
    })

    try {
      const uploadedJobs = await Promise.all(jobsPromises)

      uploadedJobs.map(job => {
        console.log(job.data)
        console.log('Done!')
        console.log('\n')
      })
      console.log(uploadedJobs.length + ' jobs were uploaded!')
    } catch (error) {
      throw new Error(error)
    }
  }

  help() {
    /* eslint-disable no-multi-spaces */
    const help =
      '\nUsage:\n' +
      '  \x1b[36mitstime\x1b[0m up <command>\n\n' +
      'Commands:\n' +
      '  today           Insert in Jobber status of today\n' +
      '  yesterday       Insert in Jobber status of yesterday\n' +
      '  <date>          Insert in Jobber status of a date <2017-06-29>\n'
    /* eslint-disable no-multi-spaces */

    console.log(help)
  }
}

module.exports = Up
