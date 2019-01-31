import { RestClient, IRestResponse } from 'typed-rest-client/RestClient'

export class Session {
  private rest: RestClient;
  readonly key: string;
  readonly contextId?: string;
  readonly kmId: string | null;

  constructor (options: string | SessionOptions) {
    let baseUrl: string;

    if (typeof options === 'string') {
      this.key = options;
      baseUrl = Session.DEFAULT_BASE_URL;
    } else {
      this.key = options.key;
      baseUrl = options.baseUrl;
      this.contextId = options.contextId;
    }

    this.kmId = null
    this.rest = new RestClient('rainbird-api-js', baseUrl);
  }

  async start (kmId?: string) {
    if (typeof kmId === 'undefined' && this.kmId === null) {
      throw new Error();
    }
  }

  static DEFAULT_BASE_URL = 'https://api.rainbird.ai';
}

export interface SessionOptions {
  key: string;
  baseUrl: string;
  contextId?: string;
  kmId?: string;
}
