import {
  logRouteHasChangedStatus,
  logRouterScheduledRouteToStatus,
} from "../../logging"
import { groupRoutesByIntendedStatus } from "./groupRoutesByIntendedStatus"
import { IntendedRouteStatus } from "./calculateIntendedRoutesStatus"
import { RouteState, RouteStatus } from "../../route"

export const orchestrateRouteTransitions = (
  routes: Record<string, RouteState>,
  debug?: boolean
): Record<string, RouteState> => {
  const updateRouteStatus = (
    routeId: string,
    route: RouteState,
    status: RouteStatus
  ) => {
    routes = {
      ...routes,
      [routeId]: { ...route, status },
    }
  }

  const groupedRoutes = groupRoutesByIntendedStatus(routes)

  const initialize = groupedRoutes[IntendedRouteStatus.Initialize]
  const initializing = groupedRoutes[IntendedRouteStatus.Initializing]
  const load = groupedRoutes[IntendedRouteStatus.Load]
  const loading = groupedRoutes[IntendedRouteStatus.Loading]
  const show = groupedRoutes[IntendedRouteStatus.Show]
  const showing = groupedRoutes[IntendedRouteStatus.Showing]
  const unload = groupedRoutes[IntendedRouteStatus.Unload]
  const unloading = groupedRoutes[IntendedRouteStatus.Unloading]
  const idle = groupedRoutes[IntendedRouteStatus.Idle]
  const idling = groupedRoutes[IntendedRouteStatus.Idling]

  if (initialize?.length || load?.length) {
    if (initialize?.length) {
      for (const routeAndId of initialize) {
        const [routeId, route] = routeAndId

        debug &&
          logRouterScheduledRouteToStatus(route.path, RouteStatus.Initialize)
        updateRouteStatus(routeId, route, RouteStatus.Initialize)
      }
    }

    if (load?.length) {
      for (const routeAndId of load) {
        const [routeId, route] = routeAndId

        debug && logRouterScheduledRouteToStatus(route.path, RouteStatus.Load)
        updateRouteStatus(routeId, route, RouteStatus.Load)
      }
    }
  } else if (initializing?.length || loading?.length) {
    // skip
  } else if (unload?.length) {
    for (const routeAndId of unload) {
      const [routeId, route] = routeAndId

      debug && logRouterScheduledRouteToStatus(route.path, RouteStatus.Unload)
      updateRouteStatus(routeId, route, RouteStatus.Unload)
    }
  } else if (unloading?.length) {
    // skip
  } else {
    if (idle?.length) {
      for (const routeAndId of idle) {
        const [routeId, route] = routeAndId

        debug && logRouteHasChangedStatus(route.path, RouteStatus.Idle)
        updateRouteStatus(routeId, route, RouteStatus.Idle)
      }
    }

    if (show?.length) {
      for (const routeAndId of show) {
        const [routeId, route] = routeAndId

        debug && logRouterScheduledRouteToStatus(route.path, RouteStatus.Show)
        updateRouteStatus(routeId, route, RouteStatus.Show)
      }
    }
  }

  return routes
}
