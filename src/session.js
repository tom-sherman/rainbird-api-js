const rb = require('./rainbird')
const Fact = require('./fact')

class Session {
  /**
   * Creates a new Session.
   * @param {object|string} options
   * @param {string} options.apiKey
   * @param {string} options.apiDomain
   * @param {string} options.contextId
   */
  constructor (options) {
    if (typeof options === 'string') {
      this.apiKey = options
    } else if (options.apiKey) {
      this.apiKey = options.apiKey
    }
    if (!rb.validUuid(this.apiKey)) {
      throw new Error('Invalid API key')
    }

    /**
     * The API domain to make requests.
     * @type {string}
     */
    this.apiDomain = options.apiDomain || Session.DEFAULT_API_DOMAIN

    /**
     * Context ID to use for the session.
     * @type {string}
     */
    this.contextId = options.contextId

    /**
     * The session ID returned from the /start method.
     * @type {?string}
     */
    this.id = null

    /**
     * The current Knowledge map ID.
     * @type {?string}
     */
    this.kmId = null

    /**
     * The current Knowledge Map version ID
     * @type {?string}
     */
    this.kmVersionId = null

    /**
     * A flag which determines if Session should store the previous responses.
     * @type {boolean}
     */
    this.recordHistory = options.recordHistory

    /**
     * An array of previous Rainbird responses.
     */
    this.history = []

    /**
     * The current query.
     * @type {{ subject: string, relationship: string, object: string }}
     */
    this.currentQuery = null
  }

  /**
   * Starts a new session.
   * Call without any arguments to get a new session with the same kmId and API options.
   * @param {string} [kmId] Knowledge map ID.
   */
  async start (kmId = this.kmId) {
    if (!rb.validUuid(kmId)) {
      throw new Error('Invalid Knowledge Map ID.')
    }

    this.kmId = kmId

    const startOptions = {
      path: '/start/' + this.kmId,
      method: 'GET'
    }

    if (this.contextId) {
      startOptions.qs = { contextid: this.contextId }
    }

    const session = await this.call(startOptions)

    this.id = session.id
    // Clear history
    this.history.length = 0
    this.currentQuery = null
    return session
  }

  /**
   * Start a new query.
   * @param {object} options
   * @param {string} options.subject
   * @param {string} options.relationship
   * @param {string} options.object
   */
  async query ({ subject, relationship, object, ...rest } = {}) {
    if (!this.id) {
      throw new Error('Session ID is not defined. Run Session.start before querying.')
    }
    const response = await this.call({
      path: `/${this.id}/query`,
      body: { subject, relationship, object, ...rest }
    })
    this.currentQuery = { subject, relationship, object }
    if (response.result) {
      return this.createFacts(response)
    }
    return response
  }

  /**
   * @typedef Fact
   * @property {string} subject
   * @property {string} relationship
   * @property {string} object
   * @property {number?} cf
   */

  /**
   * Respond to the previous question with one or more facts (answers).
   * @param {Fact[]} answers
   */
  async respond (answers) {
    if (!this.id) {
      throw new Error('Session ID is not defined. Run Session.start before querying.')
    }
    if (!Array.isArray(answers)) {
      answers = [ answers ]
    }
    for (const answer of answers) {
      if (!answer.cf) {
        answer.cf = 100
      }
    }
    const response = await this.call({
      path: `/${this.id}/response`,
      body: { answers }
    })
    if (response.result) {
      return this.createFacts(response)
    }
    return response
  }

  inject (facts) {
    if (!this.id) {
      throw new Error('Session ID is not defined. Run Session.start before querying.')
    }
    if (!Array.isArray(facts)) {
      facts = [ facts ]
    }
    for (const fact of facts) {
      if (!fact.cf) {
        fact.cf = 100
      }
    }
    return this.call({
      path: `/${this.id}/inject`,
      body: facts
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
    const response = await rb.call({
      ...opts,
      apiKey: this.apiKey,
      apiDomain: this.apiDomain
    })
    if (this.recordHistory) {
      this.history.push(response)
    }
    return response
  }

  /**
   * Creates Fact object from a Rainbird query response.
   * @param {*} response
   */
  createFacts (response) {
    const facts = response.result.map(fact => new Fact({
      apiKey: this.apiKey,
      apiDomain: this.apiDomain,
      ...fact
    }))
    return {
      facts,
      response
    }
  }

  static get DEFAULT_API_DOMAIN () {
    return rb.API_DOMAIN
  }
}

module.exports = Session
