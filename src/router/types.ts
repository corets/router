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
  redirect(to: string): void
  isLoading(): boolean
  isUnloading(): boolean
  isShowing(): boolean
}

export type UseRouter = () => RouterHandle

export type RouterRegistry = Record<string, RouteState>

export type UseRouterRegistry = () => ObservableValue<RouterRegistry>