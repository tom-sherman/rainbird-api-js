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
  const response = await client.session.query({
    subject: 'Dave',
    relationship: 'speaks'
  })

  document.body.append(JSON.stringify(response))
})()
