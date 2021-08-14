import { parse } from "query-string"
import { CreateQueryParser } from "./types"

export const createQueryParser: CreateQueryParser = () => (search) => {
  const query = parse(search)

  // query is breaking everything, need to splat it,
  // is it not a plain object? this is very strange...
  return { ...query }
}
