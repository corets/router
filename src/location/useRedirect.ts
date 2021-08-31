import { useHistory } from "./useHistory"
import { useQueryParser } from "./useQueryParser"
import { useQueryStringifier } from "./useQueryStringifier"
import { UseRedirect } from "./types"
import { useContext } from "react"
import { RouterContext } from "../router"
import { createRedirect } from "./createRedirect"

export const useRedirect: UseRedirect = (history, initialOptions) => {
  const hookedHistory = useHistory(history)
  const router = useContext(RouterContext)
  const queryParser = useQueryParser(initialOptions?.queryParser)
  const queryStringifier = useQueryStringifier(initialOptions?.queryStringifier)
  const base = initialOptions?.base ?? router?.base

  const redirect = createRedirect(hookedHistory, {
    ...initialOptions,
    queryParser,
    queryStringifier,
    base,
  })

  return redirect
}
