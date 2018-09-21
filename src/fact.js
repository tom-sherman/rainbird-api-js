const rb = require('./rainbird')

class Fact {
  constructor ({ apiKey, apiDomain, sessionId, factId, ...fact }) {
    this.data = fact
    this.id = factId
    this.apiKey = apiKey
    this.apiDomain = apiDomain
    this.sessionId = sessionId
  }

  async audit () {
    this.call({
      method: 'GET',
      path: `/analysis/evidence/${this.id}`
    })
  }

  /**
   * Sends a request to the Rainbird API.
   * @param {object} opts
   * @param {string} opts.path
   * @param {string} [opts.method = 'POST']
   * @param {object} [opts.qs]
   */
  async call (opts) {
    return rb.call({
      ...opts,
      apiKey: this.apiKey,
      apiDomain: this.apiDomain
    })
  }

  static get DEFAULT_API_DOMAIN () {
    return rb.API_DOMAIN
  }
}

module.exports = Fact
