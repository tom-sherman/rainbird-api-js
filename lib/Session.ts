import { RestClient, IRestResponse } from 'typed-rest-client/RestClient';
import { BasicCredentialHandler } from 'typed-rest-client/Handlers';

export class Session {
  private rest: RestClient;
  readonly contextId?: string;
  readonly kmId: string | null;

  constructor (options: string | SessionOptions) {
    let baseUrl: string;
    let apiKey: string;

    if (typeof options === 'string') {
      apiKey = options;
      baseUrl = Session.DEFAULT_BASE_URL;
    } else {
      apiKey = options.key;
      baseUrl = options.baseUrl;
      this.contextId = options.contextId;
    }

    this.kmId = null

    const creds = new BasicCredentialHandler(apiKey, '');
    this.rest = new RestClient('rainbird-api-js', baseUrl, [ creds ]);
  }

  async start (kmId?: string): Promise<IRestResponse<StartResponse>> {
    if (typeof kmId === 'undefined' && this.kmId === null) {
      throw new Error();
    }

    return this.rest.get<StartResponse>('/start')
  }

  static DEFAULT_BASE_URL = 'https://api.rainbird.ai';
}

export interface SessionOptions {
  key: string;
  baseUrl: string;
  contextId?: string;
  kmId?: string;
}

export interface StartResponse {
  id: string;
  kmVersion: {
    id: string;
  };
}
