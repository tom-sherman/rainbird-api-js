const rb = require('./src')
const secret = require('./secret.json')

// The following example requires a "Hello world" map ID and API key to be specified in a secret.json file.
;(async () => {
  const version = await rb.version()
  const session = new rb.Session(secret.apiKey)
  const start = await session.start(secret.maps[0])
  const query = await session.query({ subject: 'john', relationship: 'speaks' })
  const response = await session.respond({ subject: 'john', relationship: 'lives in', object: 'England' })
  const inject = await session.inject({ subject: 'tom', relationship: 'lives in', object: 'France' })
  const query2 = await session.query({ subject: 'tom', relationship: 'speaks' })
  console.log(
    version,
    session,
    start,
    query,
    response,
    inject,
    query2
  )
})()
