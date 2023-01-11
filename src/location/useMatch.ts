import { useContext, useMemo } from "react"
import { RouterContext } from "../router"
import { createPathMatcher } from "../matcher"
import { UseMatch } from "./types"
import { useHistory } from "./useHistory"

export const useMatch: UseMatch = (pattern: string, options) => {
  const router = useContext(RouterContext)
  const history = useHistory(options?.history)
  const pathMatcher = useMemo(
    () => router?.pathMatcher ?? createPathMatcher(),
    []
  )

  return pathMatcher(pattern, history.location.pathname, {
    base: options?.base ?? router?.base,
    exact: options?.exact,
  })
}
