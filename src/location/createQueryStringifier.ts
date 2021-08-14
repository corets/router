import { CreateQueryStringifier } from "./types"
import { stringify } from "query-string"

export const createQueryStringifier: CreateQueryStringifier = () => (query) =>
  stringify(query)
