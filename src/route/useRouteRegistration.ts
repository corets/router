import { useContext, useEffect, useMemo } from "react"
import { logRouteRegistered, logRouteUnregistered } from "../logging"
import { RouteGroupContext } from "./RouteGroupContext"
import {
  RouteRegistration,
  RouteState,
  RouteStatus,
  UseRouteRegistration,
} from "./types"
import { useRouterRegistry } from "../router/useRouterRegistry"

let routeIdCounter = 0

export const useRouteRegistration: UseRouteRegistration = (
  args
): RouteRegistration => {
  const { path, exact, debug } = args
  const registry = useRouterRegistry()
  const groupId = useContext(RouteGroupContext)

  const routeId = useMemo(() => {
    return (routeIdCounter++).toString()
  }, [path, exact, groupId])

  const initialRoute: RouteState = useMemo(() => {
    return {
      routeId,
      groupId,
      path,
      exact,
      status: RouteStatus.Idle,
    }
  }, [routeId])

  const reportStatus = (status: RouteStatus) => {
    const routes = registry.get()

    registry.set({
      ...routes,
      [routeId]: {
        ...routes[routeId],
        status,
      },
    })
  }

  useEffect(() => {
    registry.set({
      ...registry.get(),
      [routeId]: initialRoute,
    })
    debug && logRouteRegistered(path)

    return () => {
      const newRegistry = registry.get()
      delete newRegistry[routeId]
      registry.set(newRegistry)
      debug && logRouteUnregistered(path)
    }
  }, [routeId])

  const route = {
    ...initialRoute,
    ...registry.get()?.[routeId],
  }

  const registration: RouteRegistration = {
    route,
    reportStatus,
  }

  return registration
}
