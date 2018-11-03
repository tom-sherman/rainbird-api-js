const t = require('tap')
const Session = require('../src/session')
const fixtures = require('./fixtures')

if (!process.env.RB_API_KEY || !process.env.RB_HELLOWORLD_KMID) {
  t.fail('Must setup environment variables RB_API_KEY and RB_HELLOWORLD_KMID for tests to pass')
}

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

t.test('session::start should accept contextid', t => {
  const contextId = '123'
  const session = new Session({
    apiKey: fixtures.validApiKeys[0],
    contextId
  })
  t.equal(session.contextId, contextId)
  t.end()
})

t.test('session should remember context', async t => {
  const kmId = fixtures.validKnowledgeMapIds[0]
  const query = { subject: 'John', relationship: 'speaks' }
  const contextId = '123'

  const session1 = new Session({
    apiKey: fixtures.validApiKeys[0],
    contextId
  })
  await session1.start(kmId)

  let queryResponse1 = await session1.query(query)
  if (queryResponse1.question) {
    queryResponse1 = await session1.respond({ subject: 'John', relationship: 'lives in', object: 'England' })
  }

  const session2 = new Session({
    apiKey: fixtures.validApiKeys[0],
    contextId
  })
  await session2.start(kmId)
  const queryResponse2 = await session2.query(query)

  if (queryResponse2.question) {
    t.fail('Question should not be asked, fact should be retrieved from context.')
  }

  t.ok(queryResponse1.facts.length && queryResponse1.facts.length > 0, "Query1 didn't returned facts")
  t.ok(queryResponse2.facts.length && queryResponse1.facts.length > 0, "Query2 didn't returned facts")

  t.equal(queryResponse1.facts[0].data.object, queryResponse2.facts[0].data.object, 'Facts dont match')
  t.end()
})
