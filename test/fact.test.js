const t = require('tap')
const fixtures = require('./fixtures')
const Fact = require('../src/fact')

t.test('fact::can pass valid string keys', t => {
  const validApiKeys = [
    ...fixtures.validApiKeys,
    ...fixtures.validUUIDs
  ]
  const validOptions = [
    ...validApiKeys.map(apiKey => ({ apiKey })),
    ...validApiKeys.map(apiKey => ({ apiKey, apiDomain: 'foo' }))
  ]

  validOptions.forEach(opt => {
    t.doesNotThrow(() => new Fact(opt), opt)
  })
  t.end()
})

t.test('fact::errors with invalid string keys', t => {
  const invalidOptions = [
    ...fixtures.inValidApiKeys,
    ...fixtures.inValidApiKeys.map(apiKey => ({ apiKey })),
    ...fixtures.inValidApiKeys.map(apiKey => ({ apiKey, apiDomain: 'foo' }))
  ]

  invalidOptions.forEach(opt => {
    t.throws(() => new Fact(opt))
  })
  t.end()
})
