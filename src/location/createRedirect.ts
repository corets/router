import { CreateRedirectHandle } from "./types"
import { createQueryParser } from "./createQueryParser"
import { createQueryStringifier } from "./createQueryStringifier"
import { createPathWithBase } from "../matcher"

export const createRedirect: CreateRedirectHandle = (
  history,
  initialOptions
) => {
  const queryParser = initialOptions?.queryParser ?? createQueryParser()
  const queryStringifier =
    initialOptions?.queryStringifier ?? createQueryStringifier()

  return (path, options) => {
    const base = options?.base ?? initialOptions?.base
    const pathname = createPathWithBase(path, base)

    const newQuery = options?.query ?? {}
    const globalQuery = queryParser(history.location.search ?? "")

    const query = {
      ...(options?.preserveQuery ? globalQuery : {}),
      ...newQuery,
    }
    const hash =
      options?.hash ?? options?.preserveHash ? history.location.hash : ""
    const queryString = queryStringifier(query)
    const search = queryString ? `?${queryString}` : ""

    history.push({
      pathname,
      search,
      hash,
    })
  }
}
