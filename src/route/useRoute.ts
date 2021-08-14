import { useContext } from "react"
import { MatchedParams } from "../matcher"
import { ParsedQuery } from "../location"
import { RouteContext } from "./RouteContext"
import { RouteHandle, UseRoute } from "./types"

export const useRoute: UseRoute = <
  TParams extends MatchedParams = MatchedParams,
  TQuery extends ParsedQuery = ParsedQuery
>() => {
  const route = useContext(RouteContext) as RouteHandle<TParams, TQuery>

  if (!route) {
    throw new Error(
      "RouteContext is empty, make sure to wrap your components inside <Route/> ... </Route>"
    )
  }

  return route
}
