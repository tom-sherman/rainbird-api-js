

const agent = client.createAgent()
  // new Agent({ apiKey })

agent.on('question', (question, questionResponse) => {})

agent.on('results', (facts, resultsResponse) => {})

agent.on('error', error => {})

agent.start({ kmId }).then(() => agent.query({ s, r, o }))
