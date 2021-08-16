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
import { RouteContext } from "./RouteContext"
import { createPathWithBase } from "../matcher"

let routeIdCounter = 0

export const useRouteRegistration: UseRouteRegistration = (
  args
): RouteRegistration => {
  const { exact, debug } = args
  const registry = useRouterRegistry()
  const groupId = useContext(RouteGroupContext)
  const parentRoute = useContext(RouteContext)

  const routeId = useMemo(() => {
    return (routeIdCounter++).toString()
  }, [args.path, exact, groupId, parentRoute?.path])

  const initialRoute: RouteState = useMemo(() => {
    return {
      routeId,
      groupId,
      path: createPathWithBase(args.path, parentRoute?.path),
      exact,
      status: RouteStatus.Idle,
    }
  }, [routeId])

  const route = {
    ...initialRoute,
    ...registry.get()?.[routeId],
  }

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
    debug && logRouteRegistered(route.path)

    return () => {
      const newRegistry = registry.get()
      delete newRegistry[routeId]
      registry.set(newRegistry)
      debug && logRouteUnregistered(route.path)
    }
  }, [routeId])

  const registration: RouteRegistration = {
    route,
    reportStatus,
  }

  return registration
}
