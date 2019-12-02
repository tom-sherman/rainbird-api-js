import fetchPonyFill from 'fetch-ponyfill'
const { fetch } = fetchPonyFill()

export enum HttpCodes {
  OK = 200,
  MultipleChoices = 300,
  MovedPermanently = 301,
  ResourceMoved = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  SwitchProxy = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504
}

export class Fetch {
  static rawRequest = fetch

  static async get<T>(
    input: RequestInfo,
    init?: RequestInit | undefined
    ): Promise<FetchResponse<T>> {
      const options = Object.assign({}, init, { method: 'GET' })
    return Fetch._processResponse<T>(fetch(input, options))
  }

  static async post<T>(
    input: RequestInfo,
    body: any,
    init?: RequestInit | undefined
    ): Promise<FetchResponse<T>> {
      const options = Object.assign({}, init, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'content-type': 'application/json'}
    })
    return Fetch._processResponse<T>(fetch(input, options))
  }

  private static async _processResponse<T>(
    fetchPromise: Promise<Response>
  ): Promise<FetchResponse<T>> {
    const response = await fetchPromise
    let result: T | null

    try {
      result = await response.json()
    } catch (_) {
      result = null
    }

    return {
      statusCode: response.status,
      result,
      response
    }
  }
}

export interface FetchResponse<T> {
  statusCode: number
  result: T | null
  response: Response
}
