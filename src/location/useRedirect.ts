import { useHistory } from "./useHistory"
import { useQueryParser } from "./useQueryParser"
import { useQueryStringifier } from "./useQueryStringifier"
import { RedirectHandle, UseRedirect } from "./types"

export const useRedirect: UseRedirect = (history, options) => {
  const hookedHistory = useHistory(history)
  const queryParser = useQueryParser(options?.queryParser)
  const queryStringifier = useQueryStringifier(options?.queryStringifier)

  const redirect: RedirectHandle = (pathname, options) => {
    const newQuery = options?.query ?? {}
    const globalQuery = queryParser(hookedHistory.location.search ?? "")

    const query = {
      ...(options?.preserveQuery ? globalQuery : {}),
      ...newQuery,
    }
    const hash = options?.preserveHash ? hookedHistory.location.hash : ""
    const search = queryStringifier(query)

    hookedHistory.push({
      pathname,
      search,
      hash,
    })
  }

  return redirect
}
