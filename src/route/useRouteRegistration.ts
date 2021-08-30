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
import { RouterContext } from "../router"

let routeIdCounter = 0

export const useRouteRegistration: UseRouteRegistration = (
  args
): RouteRegistration => {
  const { exact, absolute } = args
  const registry = useRouterRegistry()
  const group = useContext(RouteGroupContext)
  const parentRoute = useContext(RouteContext)
  const router = useContext(RouterContext)

  const groupId = group?.groupId
  const loadable = args.loadable ?? group?.loadable ?? router?.loadable ?? false
  const unloadable =
    args.unloadable ?? group?.unloadable ?? router?.unloadable ?? false
  const controlled =
    args.controlled ?? group?.controlled ?? router?.controlled ?? false
  const disabled = group?.disabled || args.disabled || false
  const wait = args.wait ?? group?.wait ?? router?.wait ?? 5
  const debug = args.debug ?? group?.debug ?? router?.debug ?? false
  const parentPath = absolute ? router?.base : parentRoute?.path

  const routeId = useMemo(() => {
    return (routeIdCounter++).toString()
  }, [args.path, exact, groupId, parentRoute?.path])

  const initialRoute: RouteState = useMemo(() => {
    return {
      routeId,
      groupId,
      path: createPathWithBase(args.path, parentPath),
      exact,
      status: RouteStatus.Idle,
      disabled,
    }
  }, [routeId])

  const route: RouteState = {
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
    if (route.disabled !== disabled) {
      registry.set({
        ...registry.get(),
        [routeId]: { ...route, disabled },
      })
    }
  }, [disabled])

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
    loadable,
    unloadable,
    controlled,
    disabled,
    wait,
    debug,
    reportStatus,
  }

  return registration
}
