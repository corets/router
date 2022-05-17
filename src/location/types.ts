import { History, Location } from "history"
import { MatchedParams, MatchedPath } from "../matcher"

export type UseMatch = <TParams extends MatchedParams>(
  pattern: string,
  options?: { history?: History; base?: string; exact?: boolean }
) => MatchedPath<TParams>

export type UseLocation = (history?: History) => Location

export type UseHistory = (history?: History) => History

export type UseRedirect = (
  history?: History,
  options?: CreateRedirectHandleOptions
) => RedirectHandle

export type CreateRedirectHandleOptions = {
  base?: string
  queryParser?: QueryParser
  queryStringifier?: QueryStringifier
}

export type CreateRedirectHandle = (
  history: History,
  options?: CreateRedirectHandleOptions
) => RedirectHandle

export type RedirectHandle = (
  pathname: string,
  options?: {
    query?: ParsedQuery
    hash?: string
    base?: string
    preserveQuery?: boolean
    preserveHash?: boolean
  }
) => void

export type UseParams = <
  TParams extends MatchedParams,
  TDefaultParams = Partial<TParams>
>(
  defaultParams?: TDefaultParams
) => TParams

export type ParsedQuery = Record<string, string | null | (string | null)[]>

export type CreateQueryParser = () => QueryParser

export type QueryParser = (search: string) => ParsedQuery

export type CreateQueryStringifier = () => QueryStringifier

export type QueryStringifier = (query: ParsedQuery) => string

export type UseQueryParser = (queryParser?: QueryParser) => QueryParser

export type UseQueryStringifier = (
  queryStringifier?: QueryStringifier
) => QueryStringifier

export type UseQuery = <TQuery extends ParsedQuery>(
  defaultQuery: TQuery,
  options?: {
    queryParser?: QueryParser
    queryStringifier?: QueryStringifier
    strip?: any[]
    history?: History
  }
) => QueryHandle<TQuery>

export type QueryHandle<TQuery extends ParsedQuery> = {
  get: () => TQuery
  set: (query: Partial<TQuery>) => void
  put: (query: Partial<TQuery>) => void
}
