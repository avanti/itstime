const axios = require('axios')

class Ahgora {
  constructor(account) {
    this.account = account
    this.url = 'https://www.ahgora.com.br/externo/getApuracao'
  }

  async getReport(date) {
    try {
      const report = await axios.post(this.url, this.account)

      if (date) {
        return report.data.dias[date].batidas
      }

      return report.batidas
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = Ahgora
