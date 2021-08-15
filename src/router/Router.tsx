import React, { ReactNode, useEffect, useMemo } from "react"
import { useValue } from "@corets/use-value"
import { RouterContext } from "./index"
import { History } from "history"
import { createPathMatcher, PathMatcher } from "../matcher"
import {
  createQueryParser,
  createQueryStringifier,
  QueryParser,
  QueryStringifier,
  useHistory,
  useLocation,
  useRedirect,
} from "../location"
import { matchRoutes } from "./helpers/matchRoutes"
import { orchestrateRouteTransitions } from "./helpers/orchestrateRouteTransitions"
import { RouterRegistryContext } from "./RouterRegistryContext"
import { logRouterLocationChanged } from "../logging"
import { RouterHandle, RouterRegistry } from "./types"
import { RouteStatus } from "../route"

export type RouterProps = {
  base?: string
  children?: ReactNode
  debug?: boolean
  history?: History
  wait?: number
  loadable?: boolean
  unloadable?: boolean
  controlled?: boolean
  pathMatcher?: PathMatcher
  queryParser?: QueryParser
  queryStringifier?: QueryStringifier
}

export const Router = (props: RouterProps) => {
  const {
    base = "/",
    children,
    debug = false,
    wait = 5,
    loadable = false,
    unloadable = false,
    controlled = false,
  } = props
  const history = useHistory(props.history)
  const location = useLocation(history)
  const redirect = useRedirect(history, { base })

  const registry = useValue<RouterRegistry>({})
  const pathMatcher = useMemo(
    () => props.pathMatcher ?? createPathMatcher(),
    []
  )
  const queryParser = useMemo(
    () => props.queryParser ?? createQueryParser(),
    []
  )
  const queryStringifier = useMemo(
    () => props.queryStringifier ?? createQueryStringifier(),
    []
  )

  const isLoading = () => {
    return !!Object.values(registry.get()).find((r) =>
      [RouteStatus.Load, RouteStatus.Loaded].includes(r.status)
    )
  }

  const isUnloading = () => {
    return !!Object.values(registry.get()).find((r) =>
      [RouteStatus.Unload, RouteStatus.Unloaded].includes(r.status)
    )
  }

  const isShowing = () => {
    return !!Object.values(registry.get()).find(
      (r) => r.status === RouteStatus.Shown
    )
  }

  const router: RouterHandle = {
    base,
    debug,
    history,
    pathMatcher,
    queryParser,
    queryStringifier,
    redirect,
    wait,
    loadable,
    unloadable,
    controlled,
    isLoading,
    isUnloading,
    isShowing,
  }

  useEffect(() => {
    debug && logRouterLocationChanged(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    registry.set(
      matchRoutes({
        routes: registry.get(),
        base,
        pathMatcher,
        queryParser,
        location,
      })
    )
  }, [JSON.stringify(location), JSON.stringify(registry.get())])

  useEffect(() => {
    registry.set(orchestrateRouteTransitions(registry.get(), debug))
  }, [JSON.stringify(registry.get())])

  return (
    <RouterContext.Provider value={router}>
      <RouterRegistryContext.Provider value={registry}>
        {children}
      </RouterRegistryContext.Provider>
    </RouterContext.Provider>
  )
}
