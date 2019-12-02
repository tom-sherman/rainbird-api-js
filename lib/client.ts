import { Session, SessionOptions, StartResponse } from './session'
import { Fetch } from './fetch'

export class RainbirdClient {
  readonly apiKey: string
  readonly apiDomain: string
  static readonly DEFAULT_API_DOMAIN = 'https://api.rainbird.ai'
  private session?: Session

  constructor({
    apiKey,
    apiDomain = RainbirdClient.DEFAULT_API_DOMAIN
  }: ClientOptions) {
    this.apiKey = apiKey
    this.apiDomain = apiDomain
  }

  async version(): Promise<string> {
    const response = await Fetch.rawRequest(`${this.apiDomain}/version`)
    return response.text()
  }

  async startSession(options: CreateSessionOptions): Promise<StartResponse> {
    this.session = new Session({
      apiDomain: this.apiDomain,
      apiKey: this.apiKey,
      ...options
    })

    const startResponse = await this.session.start()
    return startResponse
  }
}

export interface ClientOptions {
  apiKey: string
  apiDomain?: string
}

export type CreateSessionOptions = Pick<SessionOptions, 'context' | 'kmId'>
