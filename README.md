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

// Inject facts
await session.inject({
  subject: 'Sam',
  relationship: 'lives in',
  object: 'France'
})

// Respond with a fact
const { facts } = await session.respond({
  subject: 'John',
  relationship: 'lives in',
  object: 'England'
})

// Get an evidence tree object by calling audit on the answer.
await facts[0].audit()
```

### Context

Context is supported but supplying a `contextId` option when creating a new `Session` eg.

```javascript
const session = new rb.Session({
  apiKey: API_KEY,
  contextId: '123'
})
```

## Notes
`Session.response` and `Session.query` can return either questions or facts (answers)


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

These can be placed in a `.env` file for convenience.

## Further reading

* https://rainbirdai.github.io/rainbird-docs/
* https://github.com/RainBirdAi
