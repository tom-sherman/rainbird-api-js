import { Fetch } from './fetch'
import { btoa } from 'isomorphic-base64'
import { Fact } from './fact'

export class Session {
  readonly context?: string
  readonly apiDomain: string
  private _id?: string
  private _kmId: string
  private apiKey: string

  constructor({ apiKey, context, apiDomain, kmId }: SessionOptions) {
    this.context = context
    this.apiDomain = apiDomain
    this._kmId = kmId
    this.apiKey = apiKey
  }

  get id(): string | undefined {
    return this._id
  }

  get kmId(): string {
    return this._kmId
  }

  private ensureId(): void {
    if (typeof this.id === 'undefined') {
      throw new Error('TODO: handle error')
    }
  }

  async start(): Promise<StartResponse> {
    const response = await Fetch.get<StartResponse>(
      `${this.apiDomain}/start/${this._kmId}`,
      { headers: { Authorization: `Basic ${btoa(`${this.apiKey}:`)}` } }
    )
    if (!response.result) {
      throw new Error('TODO: handle error')
    }

    this._id = response.result.id
    return response.result
  }

  async respond(answers: Answer[]): Promise<RespondResponse> {
    if (!this.id) {
      throw new Error('Session id is not defined. Call Session.Start first.')
    }

    const response = await Fetch.post<RespondResponse>(
      `${this.apiDomain}/${this.id}/respond`,
      { answers }
    )

    if (!response.result) {
      throw new Error('TODO: handle error')
    }

    // Set the kind property so that it is easier to distinguish the response types.
    if (typeof (response.result as ResultResponse).result !== 'undefined') {
      response.result.kind = 'result'
    } else if (
      typeof (response.result as QuestionResponse).question !== 'undefined'
    ) {
      response.result.kind = 'question'
    }

    return response.result
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

export interface SessionOptions {
  context?: string
  apiDomain: string
  kmId: string
  apiKey: string
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
