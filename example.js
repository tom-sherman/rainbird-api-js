require('dotenv').config()
const rb = require('./src')

// The following example requires a "Hello world" map ID and API key to be specified in the following env vars:
// RB_API_KEY
// RB_HELLOWORLD_KMID
;(async () => {
  const version = await rb.version()
  const session1 = new rb.Session(process.env.RB_API_KEY)
  const start1 = await session1.start(process.env.RB_HELLOWORLD_KMID)
  const query1 = await session1.query({ subject: 'john', relationship: 'speaks' })
  const response = await session1.respond({ subject: 'john', relationship: 'lives in', object: 'England' })
  const inject = await session1.inject({ subject: 'tom', relationship: 'lives in', object: 'France' })
  const query2 = await session1.query({ subject: 'tom', relationship: 'speaks' })
  const evidence = await query2.facts[0].audit()


  // The "lives in" relationship must be in context scope for this example to work.
  const session2 = await new rb.Session({
    apiKey: process.env.RB_API_KEY,
    contextId: '123'
  });
  const start2 = await session2.start(process.env.RB_HELLOWORLD_KMID)
  const query3 = await session2.query({ subject: 'John', relationship: 'speaks' })
  // The second time the above query is run, Rainbird should remember that John lives in England due to the fact being stored in context scope
  if (query3.question) {
    await session2.respond({ subject: 'John', relationship: 'lives in', object: 'England' })
  } else {
    console.log('Fact remembered from context!')
    console.log(query3.facts)
  }
  console.log(
    version,
    session1,
    start1,
    query1,
    response,
    inject,
    query2,
    evidence,
    start2,
    query3
  )
})()
