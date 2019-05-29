import "babel-polyfill"
import Client from '../lib'

const domReady = async () =>
  new Promise(resolve =>
    document.addEventListener('DOMContentLoaded', () => resolve())
  )

;(async () => {
  await domReady()
  const client = new Client({ apiKey: process.env.RB_API_KEY })
  const session = await client.startSession({ kmId: process.env.RB_HELLOWORLD_KMID })
  console.log(session)
  document.body.append(session.id)
})()
