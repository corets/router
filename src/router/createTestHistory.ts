import { createMemoryHistory, History } from "history"
import { createQueryStringifier, ParsedQuery } from "../location"

export const createTestHistory = (
  pathname: string,
  query: ParsedQuery = {}
): History => {
  const history = createMemoryHistory()
  const stringifier = createQueryStringifier()
  const search = Object.keys(query).length > 0 ? `?${stringifier(query)}` : ""

  history.push({
    pathname,
    search,
  })

  return history
}
