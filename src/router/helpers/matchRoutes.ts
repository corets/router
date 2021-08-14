import { PathMatcher } from "../../matcher"
import { Location } from "history"
import { QueryParser } from "../../location"
import { RouteState } from "../../route"

export const matchRoutes = (args: {
  base: string
  pathMatcher: PathMatcher
  queryParser: QueryParser
  routes: Record<string, RouteState>
  location: Location
}): Record<string, RouteState> => {
  const { base, pathMatcher, queryParser, routes, location } = args
  const groupsWithActiveRoutes: string[] = []

  return Object.entries(routes).reduce<Record<string, RouteState>>(
    (updatedRoutes, routeAndId) => {
      const [routeId, route] = routeAndId

      if (groupsWithActiveRoutes.includes(route.groupId as any)) {
        updatedRoutes[routeId] = { ...route, matches: false }
      } else {
        const [matches, params] = pathMatcher(route.path, location.pathname, {
          base,
          exact: route?.exact,
        })

        if (matches) {
          const query = queryParser(location.search)

          updatedRoutes[routeId] = {
            ...route,
            matches: true,
            params,
            query,
            location,
          }
        } else {
          updatedRoutes[routeId] = { ...route, matches: false }
        }

        if (route.groupId && matches) {
          groupsWithActiveRoutes.push(route.groupId)
        }
      }

      return updatedRoutes
    },
    {}
  )
}
