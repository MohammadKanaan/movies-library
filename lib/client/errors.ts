/** A failed client request: a user-facing message and the HTTP status. */
export class RequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'RequestError'
  }
}

const messageOf = async (response: Response) => {
  try {
    const body: unknown = await response.json()
    if (typeof body === 'object' && body !== null && 'message' in body) {
      return typeof body.message === 'string' ? body.message : null
    }
  } catch {
    // Not JSON: an outage page, say.
  }
  return null
}

/** The error for a failed response: the API's `ErrorBody` message when there is one, else `fallback`. */
export const requestErrorOf = async (response: Response, fallback: string) =>
  new RequestError((await messageOf(response)) ?? fallback, response.status)
