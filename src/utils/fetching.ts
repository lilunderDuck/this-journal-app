import { HttpMethod } from "~/common"

const BASE_PATH = 'http://localhost:8000'
export async function fetchIt<Data extends {} = {}>(method: HttpMethod, path: string, body = {}): Promise<Data | null> {
  console.groupCollapsed(`--> ${method}:`, BASE_PATH + path)
  const methodsThatAllowABody = ['POST', 'PATCH'].includes(method)

  const response = await fetch(BASE_PATH + path, {
    method,
    ...(methodsThatAllowABody ? {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    } : {}),
  })

  if (isServerResponsesWithBadStatusCode(response.status)) {
    console.error(`<-- ${method}: ${BASE_PATH + path} - not okay, https://http.cat/${response.status} :(`)
    console.groupEnd()
    return null
  }

  console.log(`okay, https://http.cat/${response.status} :)`)
  
  return await tryConvertingToJson(response) as Data
}

function isServerResponsesWithBadStatusCode(statusCode: number) {
  return statusCode >= 400
}

async function tryConvertingToJson(response: Response) {
  let json: {} | null = {}
  try {
    json = await response.json()
  } catch (error) {
    console.warn(
      "can't convert into json, the server might be response with something else and not json\n",
      `| the suppressed error is:`, error
    )
    json = null
  }

  console.log('data:', json)

  console.groupEnd()
  return json
}