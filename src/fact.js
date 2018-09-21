const rb = require('./rainbird')

class Fact {
  constructor ({ apiKey, apiDomain, sessionId, factID, ...fact }) {
    this.data = fact
    this.id = factID
    this.apiKey = apiKey
    this.apiDomain = apiDomain || Fact.DEFAULT_API_DOMAIN
    this.sessionId = sessionId
  }

  async audit () {
    return rb.call({
      method: 'GET',
      path: `/analysis/evidence/${this.id}`,
      apiKey: this.apiKey,
      apiDomain: this.apiDomain
    })
  }

  static get DEFAULT_API_DOMAIN () {
    return rb.API_DOMAIN
  }
}

module.exports = Fact
