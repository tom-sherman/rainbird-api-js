const t = require('tap')
const rb = require('../src/rainbird')
const fixtures = require('./fixtures')

t.test('rainbird::constants return strings', t => {
  const constants = [ rb.API_DOMAIN, rb.API_SOURCE ]
  constants.forEach(constant => {
    t.type(constant, 'string', constant)
    t.ok(constant.length > 0, constant)
  })
  t.end()
})

t.test('rainbird::can get api version', async t => {
  const reVersion = /([\d.])*\d+$/
  const versionResponse = await rb.version()
  t.ok(reVersion.test(versionResponse), `Successfully got version ${versionResponse}`)
  t.end()
})
  .catch(t.threw)

t.test('rainbird::valid api keys are valid', t => {
  fixtures.validApiKeys.concat(fixtures.validUUIDs).forEach(apiKey => {
    t.ok(rb.validUuid(apiKey))
  })
  t.end()
})

t.test('rainbird::invalid api keys are invalid', t => {
  fixtures.inValidApiKeys.forEach(apiKey => {
    t.notOk(rb.validUuid(apiKey))
  })
  t.end()
})

const kmId = fixtures.validKnowledgeMapIds[0]

t.test('rainbird::call resolves on valid api keys', t => {
  fixtures.validApiKeys.forEach(apiKey => {
    t.resolves(rb.call({
      apiKey,
      method: 'GET',
      path: `/start/${kmId}`
    }))
  })
  t.end()
})

t.test('rainbird::call rejects on invalid api keys', t => {
  fixtures.inValidApiKeys.forEach(apiKey => {
    t.rejects(rb.call({
      apiKey,
      method: 'GET',
      path: `/start/${kmId}`
    }))
  })
  t.end()
})
