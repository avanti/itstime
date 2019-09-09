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
      this.date = moment()
        .subtract(1, 'day')
        .format()
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
      user_agent: 'carlo.schneider@penseavanti.com.br',
    }
    /* eslint-disable camelcase */

    try {
      const report = await toggl.getReport(filter)

      return {
        report,
        normalize: this.normalizeTogglReport(report),
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
        end: currentValue.end,
      }

      return accumulator.concat(object)
    }, [])
  }

  splitJobId(string) {
    if (/(#)([0-9]*)/gi.test(string) === false) {
      const error = 'Please set a valid description in Toggl. Ie: #123 - Task name'

      console.log('Error:', error)
      throw new Error(error)
    }

    const [, , id, , description] = /(#)([0-9]*)/gi.exec(string)

    return {
      id,
      description,
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
      ano: moment(this.date).format('YYYY'),
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
      normalize: this.normalizeAhgoraReport(report),
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
      minute,
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
        IDUsr: 23,
        IDTarefa: currentValue.id,
        Manual: true,
        Inicio: moment(currentValue.start)
          .second(0)
          .format('YYYY-MM-DDTHH:mm:ss.000Z'),
      }

      if (index === 0) {
        entry.Inicio = moment(hits[0])
          .second(0)
          .format('YYYY-MM-DDTHH:mm:ss.000Z')
      } else {
        const prev = entries[index - 1]

        const previousEnd = moment(prev.end)
        const currentStart = moment(currentValue.start)

        if (currentStart.diff(previousEnd, 'minutes') > 50) {
          accumulator[index - 1].Fim = moment(hits[1])
            .second(0)
            .format('YYYY-MM-DDTHH:mm:ss.000Z')

          entry.Inicio = moment(hits[2])
            .second(0)
            .format('YYYY-MM-DDTHH:mm:ss.000Z')
        } else {
          accumulator[index - 1].Fim = moment(currentValue.start)
            .second(0)
            .format('YYYY-MM-DDTHH:mm:ss.000Z')
        }

        if (index === entriesLength - 1) {
          entry.Fim = moment(hits[hitsLength - 1])
            .second(0)
            .format('YYYY-MM-DDTHH:mm:ss.000Z')
        }
      }

      return accumulator.concat(entry)
    }, [])
  }
}

module.exports = Commom
