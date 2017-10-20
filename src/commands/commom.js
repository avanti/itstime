const moment = require('moment')

const Bootstrap = require('../libs/bootstrap')
const Toggl = require('../libs/toggl')
const Ahgora = require('../libs/ahgora')

class Commom {
  constructor(args) {
    this.args = args

    this.bootstrap = new Bootstrap()

    this.setDate()
  }

  setDate() {
    const argDate = this.args._[1]

    if (argDate === 'today' || typeof argDate === 'undefined') {
      this.date = moment().format()
    } else if (argDate === 'yesterday') {
      this.date = moment().subtract(1, 'day').format()
    } else {
      this.date = moment(argDate).format()
    }
  }

  async setConfig() {
    let config

    try {
      config = await this.bootstrap.getContent()
    } catch (err) {
      console.log('Error:', err)
      throw new Error(err)
    }

    return config
  }

  /**
   * Toggl
   */
  async getTogglEntries() {
    const token = this.config.toggl_token
    const toggl = new Toggl(token)

    const filterDate = moment(this.date).format('YYYY-MM-DD')

    /* eslint-disable camelcase */
    const filter = {
      since: filterDate,
      until: filterDate,
      workspace_id: this.config.toggl_workspaceId,
      order_desc: 'off',
      user_agent: 'carlo.schneider@penseavanti.com.br'
    }
    /* eslint-disable camelcase */

    try {
      const report = await toggl.getReport(filter)

      return {
        report,
        normalize: this.normalizeTogglReport(report)
      }
    } catch (err) {
      console.log('Error:', err)
      throw new Error(err)
    }
  }

  normalizeTogglReport(report) {
    const data = report.data

    return data.reduce((accumulator, currentValue) => {
      const split = this.splitJobId(currentValue.description)

      const object = {
        id: split.id,
        description: split.description,
        start: currentValue.start,
        end: currentValue.end
      }

      return accumulator.concat(object)
    }, [])
  }

  splitJobId(string) {
    if (/(#)([0-9]*)( - )(.*)/gi.test(string) === false) {
      const error = 'Please set a valid description in Toggl. Ie: #123 - Task name'

      console.log('Error:', error)
      throw new Error(error)
    }

    const [, , id, , description] = /(#)([0-9]*)( - )(.*)/gi.exec(string)

    return {
      id,
      description
    }
  }

  /**
   * Ahgora
   */
  async getAhgoraHits() {
    const account = {
      company: this.config.ahgora_id,
      matricula: this.config.ahgora_userId,
      senha: this.config.ahgora_password,
      mes: moment(this.date).format('MM'),
      ano: moment(this.date).format('YYYY')
    }

    const ahgora = new Ahgora(account)

    const date = moment(this.date).format('YYYY-MM-DD')

    let report

    try {
      report = await ahgora.getReport(date)
    } catch (err) {
      console.log('Error:', err)
      throw new Error(err)
    }

    if (report.length % 2 > 0) {
      const err = 'Odd hits'
      console.log('Error:', err)
      throw new Error(err)
    }

    return {
      report,
      normalize: this.normalizeAhgoraReport(report)
    }
  }

  normalizeAhgoraReport(report) {
    return report.reduce((accumulator, currentValue) => {
      const time = this.splitAhgoraTime(currentValue.hora)
      const formated = moment(this.date)
        .second(0)
        .minute(time.minute)
        .hour(time.hour)
        .format()

      return accumulator.concat(formated)
    }, [])
  }

  splitAhgoraTime(time) {
    const hour = parseInt(time.substr(0, 2), 10)
    const minute = parseInt(time.substr(2), 10)

    return {
      hour,
      minute
    }
  }

  /**
   * Mount
   */
  mountInteractions(entries, hits) {
    const hitsLength = hits.length
    const entriesLength = entries.length

    return entries.reduce((accumulator, currentValue, index) => {
      const entry = {
        user_id: this.config.jobber_userId,
        job_id: currentValue.id,
        description: currentValue.description,
        start: moment(currentValue.start),
        started_at: moment(currentValue.start).second(0).format('YYYY-MM-DD HH:mm:ss'),
        _started_at_hour: moment(currentValue.start).format('HH:mm'),
        started_at_date: moment().second(0).format('YYYY-MM-DD HH:mm:ss'),
        finished_at_date: moment().second(0).format('YYYY-MM-DD HH:mm:ss')
      }

      if (index === 0) {
        entry.started_at = moment(hits[0]).second(0).format('YYYY-MM-DD HH:mm:ss')
        entry._started_at_hour = moment(hits[0]).format('HH:mm')
      } else {
        const prev = entries[index - 1]

        const previousEnd = moment(prev.end)
        const currentStart = moment(currentValue.start)

        if (currentStart.diff(previousEnd, 'minutes') > 50) {
          accumulator[index - 1].finished_at = moment(hits[1]).second(0).format('YYYY-MM-DD HH:mm:ss')
          accumulator[index - 1]._finished_at_hour = moment(hits[1]).format('HH:mm')

          entry.started_at = moment(hits[2]).second(0).format('YYYY-MM-DD HH:mm:ss')
          entry._started_at_hour = moment(hits[2]).format('HH:mm')
        } else {
          accumulator[index - 1].end = currentValue.start
          accumulator[index - 1].finished_at = moment(currentValue.start).second(0).format('YYYY-MM-DD HH:mm:ss')
          accumulator[index - 1]._finished_at_hour = moment(currentValue.start).format('HH:mm')
        }

        if (index === entriesLength - 1) {
          entry.finished_at = moment(hits[hitsLength - 1]).second(0).format('YYYY-MM-DD HH:mm:ss')
          entry._finished_at_hour = moment(hits[hitsLength - 1]).format('HH:mm')
        }
      }

      return accumulator.concat(entry)
    }, [])
  }
}

module.exports = Commom
