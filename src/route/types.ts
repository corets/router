import { ComponentType } from "react"
import { MatchedParams } from "../matcher"
import { ParsedQuery } from "../location"
import { Location } from "history"

export enum RouteStatus {
  Idle = "IDLE",
  Show = "SHOW",
  Initialize = "INITIALIZE",
  Initialized = "INITIALIZED",
  Load = "LOAD",
  Loaded = "LOADED",
  Unload = "UNLOAD",
  Unloaded = "UNLOADED",
}

export type RouteLoader = () => RouteRenderer | Promise<RouteRenderer>

export type RouteRenderer = JSX.Element | ComponentType<any>

export type RouteState<
  TParams extends MatchedParams = MatchedParams,
  TQuery extends ParsedQuery = ParsedQuery
> = {
  groupId?: string
  path: string
  exact: boolean
  status: RouteStatus
  location?: Location
  matches?: boolean
  params?: TParams
  query?: TQuery
}

export type RouteHandle<
  TParams extends MatchedParams = MatchedParams,
  TQuery extends ParsedQuery = ParsedQuery
> = {
  params?: TParams
  query?: TQuery
  path: string
  exact: boolean
  status: RouteStatus
  loadable: boolean
  unloadable: boolean
  controlled: boolean
  debug: boolean
  isLoading(): boolean
  isUnloading(): boolean
  isShowing(): boolean
  redirect(to: string, options?: { base?: string }): void
}

export type UseRoute = <
  TParams extends MatchedParams = MatchedParams,
  TQuery extends ParsedQuery = ParsedQuery
>() => RouteHandle<TParams, TQuery>

export type UseRouteRegistration = (args: {
  path: string
  exact: boolean
  debug: boolean
}) => RouteRegistration

export type RouteRegistration = {
  route: RouteState
  reportStatus(status: RouteStatus): void
}

export type UseRouteStatus = () => RouteStatus

export type UseRouteIsLoading = () => boolean

export type UseRouteIsUnloading = () => boolean

export type UseRouteIsShowing = () => boolean

export type RouteLifeCycleHandle = {
  isLoading(): boolean
  isUnloading(): boolean
  getLoadersCount(): number
  getUnloadersCount(): number
  getActiveLoadersCount(): number
  getActiveUnloadersCount(): number
  createLoader(): RouteLifeCycleLoaderHandle
  createUnloader(): RouteLifeCycleUnloaderHandle
  clearLoaders(): void
  clearUnloaders(): void
}

export type RouteLifeCycleLoaderHandle = {
  isRunning(): boolean
  start(): void
  stop(): void
}

export type RouteLifeCycleUnloaderHandle = {
  isRunning(): boolean
  start(): void
  stop(): void
}

export type UseRouteLifeCycle = () => RouteLifeCycleHandle

export type UseRouteLoader = (
  loader?: () => Promise<void> | void
) => {
  done(): void
  isRunning(): boolean
}

export type UseRouteUnloader = (
  unloader?: () => Promise<void> | void
) => {
  done(): void
  isRunning(): boolean
}
