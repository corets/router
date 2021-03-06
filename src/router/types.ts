import { History } from "history"
import { PathMatcher } from "../matcher"
import { QueryParser, QueryStringifier } from "../location"
import { ObservableValue } from "@corets/value"
import { RouteState } from "../route"

export type RouterHandle = {
  base: string
  debug: boolean
  history: History
  pathMatcher: PathMatcher
  queryParser: QueryParser
  queryStringifier: QueryStringifier
  wait: number
  loadable: boolean
  unloadable: boolean
  controlled: boolean
  getRoutes(): RouterRegistry
  redirect(to: string, options?: { base?: string }): void
  isLoading(): boolean
  isUnloading(): boolean
  isVisible(): boolean
}

export type UseRouter = () => RouterHandle

export type RouterRegistry = Record<string, RouteState>

export type UseRouterRegistry = () => ObservableValue<RouterRegistry>

export type UseRouterIsLoading = () => boolean

export type UseRouterIsUnloading = () => boolean

export type UseRouterIsVisible = () => boolean

export type UsePathWithBase = (path: string, base?: string) => string

export type UseRoutes = () => RouterRegistry
