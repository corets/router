import { useContext, useMemo } from "react"
import { useLocation } from "./useLocation"
import { useHistory } from "./useHistory"
import { useQueryParser } from "./useQueryParser"
import { useQueryStringifier } from "./useQueryStringifier"
import { ParsedQuery, UseQuery } from "./types"
import { RouteContext } from "../route"

const DEFAULT_STRIP_LIST = [
  undefined,
  null,
  false,
  0,
  "undefined",
  "null",
  "false",
  "0",
  "",
]

export const useQuery: UseQuery = (defaultQuery, options) => {
  const route = useContext(RouteContext)
  const queryParser = useQueryParser(options?.queryParser)
  const queryStringifier = useQueryStringifier(options?.queryStringifier)
  const strip = [...(options?.strip ?? DEFAULT_STRIP_LIST), null]
  const history = useHistory(options?.history)
  const location = useLocation(history)

  const globalQuery = useMemo(() => queryParser(location.search), [
    location.search,
  ])

  const query = useMemo(() => {
    const routeQuery = {
      // apply global query state
      ...globalQuery,
      // apply route query to prevent leaking if query changes
      // into views that are being unloaded, only happens if there
      // is actually a route available
      ...route?.query,
    }

    const finalQuery = {
      ...defaultQuery,
      ...stripIgnoredValues(
        //
        defaultQuery
          ? pickRelevantQueryParts(defaultQuery, routeQuery)
          : routeQuery,
        strip
      ),
    }

    return finalQuery
  }, [
    JSON.stringify(defaultQuery),
    JSON.stringify(globalQuery),
    JSON.stringify(route?.query),
  ])

  const updateQuery = (newQuery: Partial<ParsedQuery>) => {
    const finalQuery = {
      // do not touch values that are not tracked
      ...pickIrrelevantQueryParts(defaultQuery, globalQuery),
      // strip values that should never end up in the url,
      // defaultQuery will be use as fallback for those values
      ...stripIgnoredValues({ ...(newQuery as any) }, strip),
    }
    const queryString = queryStringifier(finalQuery)

    history.push({ search: `?${queryString}` })
  }

  return {
    get: () => query,
    set: (newQuery: Partial<ParsedQuery>) => updateQuery(newQuery),
    put: (newQuery: Partial<ParsedQuery>) =>
      updateQuery({ ...query, ...newQuery }),
  }
}

const pickRelevantQueryParts = (
  template: ParsedQuery,
  fullQuery: ParsedQuery
): ParsedQuery => {
  const relevantKeys = Object.keys(template)

  return Object.fromEntries(
    Object.entries(fullQuery).filter((keyAndValue) => {
      const [key] = keyAndValue

      return relevantKeys.includes(key)
    })
  )
}

const pickIrrelevantQueryParts = (
  template: ParsedQuery,
  fullQuery: ParsedQuery
): ParsedQuery => {
  const relevantKeys = Object.keys(template)

  return Object.fromEntries(
    Object.entries(fullQuery).filter((keyAndValue) => {
      const [key] = keyAndValue

      return !relevantKeys.includes(key)
    })
  )
}

const stripIgnoredValues = (query: ParsedQuery, strip: any[]): ParsedQuery => {
  return Object.fromEntries(
    Object.entries(query).filter((keyAndValue) => {
      const [key, value] = keyAndValue

      return !strip.includes(value)
    })
  )
}
