# rainbird-api-js
A promise-based wrapper around the Rainbird API

## Install
```
npm install rainbird-api --save
```

## Usage
```javascript
const rb = require('rainbird-api')

// Start a new session
const session = new rb.Session(apiKey)
await session.start(knowledgeMapId)

await session.query({
  subject: 'John',
  relationship: 'speaks'
})
// > { question: { prompt: 'Where does John live?', ... } }

// Respond with a fact
await session.respond({
  subject: 'John',
  relationship: 'lives in',
  object: 'England'
})

// Inject facts
await session.inject({
  subject: 'Sam',
  relationship: 'lives in',
  object: 'France'
})
```
