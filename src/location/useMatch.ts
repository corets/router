import { useContext, useMemo } from "react"
import { useLocation } from "./useLocation"
import { RouterContext } from "../router"
import { createPathMatcher } from "../matcher"
import { UseMatch } from "./types"

export const useMatch: UseMatch = (pattern: string, options) => {
  const router = useContext(RouterContext)
  const location = useLocation(options?.history)
  const pathMatcher = useMemo(
    () => router?.pathMatcher ?? createPathMatcher(),
    []
  )

  return pathMatcher(pattern, location.pathname, {
    base: options?.base ?? router?.base,
    exact: options?.exact,
  })
}
