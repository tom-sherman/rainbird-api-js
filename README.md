# rainbird-api-js [![Build Status](https://travis-ci.org/tom-sherman/rainbird-api-js.svg?branch=master)](https://travis-ci.org/tom-sherman/rainbird-api-js)
A promise-based wrapper around the [Rainbird](https://rainbird.ai/) API

## Install
Requires Node v8.11.0 or later.

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

## Development

Clone and install dependencies

```
git clone https://github.com/tom-sherman/rainbird-api-js
cd rainbird-api-js
npm install
```

You must set the following environment variables to be able to run tests:
* `RB_API_KEY` - A valid Rainbird API key.
* `RB_HELLOWORLD_KMID` - A "Hello World" knowledge map.

## Further reading

* https://rainbirdai.github.io/rainbird-docs/
* https://github.com/RainBirdAi
