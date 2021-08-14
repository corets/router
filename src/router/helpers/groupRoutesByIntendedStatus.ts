import {
  calculateIntendedRoutesStatus,
  IntendedRouteStatus,
} from "./calculateIntendedRoutesStatus"
import { RouteState } from "../../route"

export type RoutesGroupedByIntendedStatus = {
  [key in IntendedRouteStatus]?: [string, RouteState][]
}

export const groupRoutesByIntendedStatus = (
  routes: Record<string, RouteState>
): RoutesGroupedByIntendedStatus => {
  return Object.entries(routes).reduce<RoutesGroupedByIntendedStatus>(
    (groups, routeAndId) => {
      const [routeId, route] = routeAndId
      const intendedStatus = calculateIntendedRoutesStatus(
        route.status,
        route.matches ?? false
      )

      groups[intendedStatus] = [...(groups[intendedStatus] ?? []), routeAndId]

      return groups
    },
    {}
  )
}
