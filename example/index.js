import "babel-polyfill"
// TODO: Once the typescript version is published, install as dep from npm.
import Client from '../lib'

const domReady = async () =>
  new Promise(resolve =>
    document.addEventListener('DOMContentLoaded', () => resolve())
  )

;(async () => {
  await domReady()
  const client = new Client({ apiKey: process.env.RB_API_KEY })
  await client.startSession({ kmId: process.env.RB_HELLOWORLD_KMID })
  await client.session.query({
    subject: 'Dave',
    relationship: 'speaks'
  })

  const response = await client.session.respond({
    subject: 'Dave',
    relationship: 'lives in',
    object: 'England',
    cf: 100
  })

  document.body.append(JSON.stringify(response))
})()
