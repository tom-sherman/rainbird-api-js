const request = require('request-promise-native')

/**
 * Default Rainbird API domain.
 */
const API_DOMAIN = 'https://api.rainbird.ai'

/**
 * Specifies source=API_SOURCE in Rainbird requests.
 */
const API_SOURCE = 'rainbird-api-js'

/**
 * A regex for Rainbird API keys.
 */
const reValidUuid = /^[a-z\d]{8}-([a-z\d]{4}-){3}[a-z\d]{12}$/

/**
 * Returns true if passed a valid API key.
 * @param {string} apiKey
 * @returns {boolean}
 */
const validUuid = apiKey => typeof apiKey === 'string' && reValidUuid.test(apiKey)

/**
 * Sends a request to the Rainbird API.
 * @param {object} opts
 * @param {string} opts.apiKey
 * @param {string} opts.path
 * @param {object} [opts.body]
 * @param {object} [opts.qs]
 * @param {string} [opts.method = 'POST']
 * @param {string} [opts.apiDomain = Rainbird.API_DOMAIN]
 */
const call = async ({ apiKey, body, path, qs, method = 'POST', apiDomain = API_DOMAIN, ...options } = {}) => {
  if (!validUuid(apiKey)) throw new Error('Invalid API key.')

  if (typeof qs === 'undefined') {
    qs = { source: API_SOURCE }
  } else {
    qs.source = API_SOURCE
  }

  const requestOptions = {
    url: apiDomain + path,
    auth: { user: apiKey },
    method,
    headers: { 'Content-Type': 'application/json' },
    qs,
    ...options
  }

  if (method === 'POST') {
    requestOptions.body = JSON.stringify(body)
  }

  try {
    const response = await request(requestOptions)
    return JSON.parse(response)
  } catch (err) {
    try {
      err.message = JSON.parse(err.error).err[0]
      throw (err)
    } catch (_) {
      throw (err)
    }
  }
}

/**
 * Gets the current Rainbird version from /version
 * @param {string} [apiDomain = API_DOMAIN]
 * @returns {Promise<string>}
 */
const version = async (apiDomain = API_DOMAIN) => request(`${apiDomain}/version?source=${API_SOURCE}`)

module.exports = {
  API_DOMAIN,
  API_SOURCE,
  call,
  validUuid,
  version
}
