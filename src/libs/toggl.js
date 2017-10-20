const axios = require('axios')

class Toggl {
  constructor(token) {
    this.token = token
    this.url = 'https://toggl.com/reports/api/v2/details'
  }

  async getReport(filter) {
    try {
      const report = await axios.get(this.url, {
        params: filter,
        auth: {
          username: this.token,
          password: 'api_token'
        }
      })

      return report.data
    } catch (err) {
      console.error('Error: On request toggle entries.')
      throw new Error(err)
    }
  }
}

module.exports = Toggl
