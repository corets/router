import { useHistory } from "./useHistory"
import { useQueryParser } from "./useQueryParser"
import { useQueryStringifier } from "./useQueryStringifier"
import { RedirectHandle, UseRedirect } from "./types"
import { useContext } from "react"
import { RouterContext } from "../router"
import { createPathWithBase } from "../matcher"

export const useRedirect: UseRedirect = (history, initialOptions) => {
  const hookedHistory = useHistory(history)
  const router = useContext(RouterContext)
  const queryParser = useQueryParser(initialOptions?.queryParser)
  const queryStringifier = useQueryStringifier(initialOptions?.queryStringifier)

  const redirect: RedirectHandle = (path, options) => {
    const base = options?.base ?? initialOptions?.base ?? router?.base
    const pathname = createPathWithBase(path, base)

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
