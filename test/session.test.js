const t = require('tap')
const Session = require('../src/session')
const fixtures = require('./fixtures')

t.test('session::can pass valid string keys', t => {
  const validApiKeys = [
    ...fixtures.validApiKeys,
    ...fixtures.validUUIDs
  ]
  const validOptions = [
    ...validApiKeys,
    ...validApiKeys.map(apiKey => ({ apiKey })),
    ...validApiKeys.map(apiKey => ({ apiKey, apiDomain: 'foo' }))
  ]

  validOptions.forEach(opt => {
    t.doesNotThrow(() => new Session(opt), opt)
  })
  t.end()
})

t.test('session::errors with invalid string keys', t => {
  const invalidOptions = [
    ...fixtures.inValidApiKeys,
    ...fixtures.inValidApiKeys.map(apiKey => ({ apiKey })),
    ...fixtures.inValidApiKeys.map(apiKey => ({ apiKey, apiDomain: 'foo' }))
  ]

  invalidOptions.forEach(opt => {
    t.throws(() => new Session(opt))
  })
  t.end()
})

t.test('session::start should resolve with valid options', async t => {
  for (const kmId of fixtures.validKnowledgeMapIds) {
    let sessions = await Promise.all([
      (new Session(fixtures.validApiKeys[0])).start(kmId),
      (new Session({ apiKey: fixtures.validApiKeys[0] })).start(kmId)
    ])
    sessions.forEach(session => {
      t.type(session.id, 'string')
      t.ok(session.id.length > 0)
    })
  }
})

t.test('session::start should reject with invalid options', async t => {
  t.rejects((new Session(fixtures.validApiKeys[0])).start('foo'))
})
