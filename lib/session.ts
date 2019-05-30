import { Fetch } from './fetch'
import { btoa } from 'isomorphic-base64'
import { Fact } from './fact'

export class Session {
  readonly context?: string
  readonly apiDomain: string
  private _id?: string
  private _kmId: string
  private _apiKey: string

  constructor({ apiKey, context, apiDomain, kmId }: SessionOptions) {
    this.context = context
    this.apiDomain = apiDomain
    this._kmId = kmId
    this._apiKey = apiKey
  }

  get id(): string | undefined {
    return this._id
  }

  get kmId(): string {
    return this._kmId
  }

  async start(): Promise<StartResponse> {
    const response = await Fetch.get<StartResponse>(
      `${this.apiDomain}/start/${this._kmId}`,
      { headers: { Authorization: `Basic ${btoa(`${this._apiKey}:`)}` } }
    )
    if (!response.result) {
      throw new Error('TODO: handle error')
    }

    this._id = response.result.id
    return response.result
  }

  async query(options: QueryOptions): Promise<RespondResponse> {
    if (!this.id) {
      throw new Error('Session id is not defined. Call Session.Start first.')
    }

    if (!options.object && !options.subject) {
      throw new Error(
        'Rainbird queries require either subject, object, or both.'
      )
    }

    const response = await Fetch.post<RespondResponse>(
      `${this.apiDomain}/${this.id}/query`,
      options
    )

    if (!response.result) {
      throw new Error('TODO: handle error')
    }

    return transformResult(response.result)
  }

  async respond(answers: Answer | Answer[]): Promise<RespondResponse> {
    if (!this.id) {
      throw new Error('Session id is not defined. Call Session.Start first.')
    }

    const response = await Fetch.post<RespondResponse>(
      `${this.apiDomain}/${this.id}/response`,
      { answers: Array.isArray(answers) ? answers : [answers] }
    )

    if (!response.result) {
      throw new Error('TODO: handle error')
    }

    return transformResult(response.result)
  }

  async inject(facts: Fact[]): Promise<InjectResponse> {
    if (!this.id) {
      throw new Error('Session id is not defined. Call Session.Start first.')
    }

    const response = await Fetch.post<InjectResponse>(
      `${this.apiDomain}/${this.id}/inject`,
      facts
    )

    if (!response.result) {
      throw new Error('TODO: handle error')
    }

    return response.result
  }
}

/**
 * A helper function to set the kind property on the response object as well
 * as add a `facts` array if the response is a result.
 */
function transformResult(
  result: ResultResponse | QuestionResponse
): ResultResponse | QuestionResponse {
  if (typeof (result as ResultResponse).result !== 'undefined') {
    result.kind = 'result'
  } else if (typeof (result as QuestionResponse).question !== 'undefined') {
    result.kind = 'question'
  }

  if (result.kind === 'result') {
    result.facts = result.result.map(res => new Fact(res))
  }
  return result
}

export interface SessionOptions {
  context?: string
  apiDomain: string
  kmId: string
  apiKey: string
}

interface QueryOptions {
  subject?: string
  relationship: string
  object?: string
}

export interface StartResponse {
  id: string
  kmVersion: {
    id: string
  }
}

export interface QuestionResponse {
  kind: 'question'
  question: {
    subject: string
    dataType: string // TODO: enum
    relationship: string
    type: string // TODO: enum
    plural: boolean
    allowCF: boolean
    canAdd: boolean
    prompt: string
    knownAnswers: [] // TODO: Type answers
    meta: {
      ruleStack: [{ name: string }]
    }
    sid: string
  }
}

export interface ResultResponse {
  kind: 'result'
  facts: Fact[]
  result: ResultFact[]
  stats: any // TODO: add types
  sid: string
}

export interface ResultFact extends Fact {
  objectMetadata?: string
  subjectMetadata?: string
  factID: string
}

export type RespondResponse = ResultResponse | QuestionResponse

export interface InjectResponse {
  result: 'OK'
}

export interface Answer extends Fact {
  // TODO: add props
}
