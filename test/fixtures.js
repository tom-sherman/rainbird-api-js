const secret = require('../secret.json')

module.exports.validApiKeys = [
  secret.apiKey
]

module.exports.validUUIDs = [
  '12345678-1234-1234-1234-123456789abc',
  '051d4530-b2bc-11e8-96f8-529269fb1459',
  '051d49b8-b2bc-11e8-96f8-529269fb1459',
  '051d4cec-b2bc-11e8-96f8-529269fb1459',
  '051d5048-b2bc-11e8-96f8-529269fb1459'
]

module.exports.inValidApiKeys = [
  0,
  1,
  true,
  false,
  '1',
  '',
  null,
  void 0,
  undefined,
  '12345678-1234-123456789abc',
  '12345678-1234-123456789abcd',
  '12345678-1234-123456789ab',
  '123456789-1234-123456789abc',
  '1234567-1234-123456789abc',
  '12345678-1234-1234-1234-123456789abcd',
  '12345678-1234-1234-1234-123456789ab',
  '123456789-1234-1234-1234-123456789abc',
  '1234567-1234-1234-1234-123456789abc'
]

/**
 * @type {string[]}
 */
module.exports.validKnowledgeMapIds = secret.maps

module.exports.inValidKnowledgeMapIds = [
  'foo',
  'abc'
]
