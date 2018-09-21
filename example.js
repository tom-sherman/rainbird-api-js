require('dotenv').config()
const rb = require('./src')

// The following example requires a "Hello world" map ID and API key to be specified in the following env vars:
// RB_API_KEY
// RB_HELLOWORLD_KMID
;(async () => {
  const version = await rb.version()
  const session = new rb.Session(process.env.RB_API_KEY)
  const start = await session.start(process.env.RB_HELLOWORLD_KMID)
  const query = await session.query({ subject: 'john', relationship: 'speaks' })
  const response = await session.respond({ subject: 'john', relationship: 'lives in', object: 'England' })
  const inject = await session.inject({ subject: 'tom', relationship: 'lives in', object: 'France' })
  const query2 = await session.query({ subject: 'tom', relationship: 'speaks' })
  const evidence = await query2.facts[0].audit()
  console.log(
    version,
    session,
    start,
    query,
    response,
    inject,
    query2,
    evidence
  )
})()
