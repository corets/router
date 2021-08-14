import { useContext, useMemo } from "react"
import { RouterContext } from "../router"
import { UseQueryStringifier } from "./types"
import { createQueryStringifier } from "./createQueryStringifier"

export const useQueryStringifier: UseQueryStringifier = (queryStringifier) => {
  const router = useContext(RouterContext)
  const stringifier = useMemo(
    () =>
      queryStringifier ?? router?.queryStringifier ?? createQueryStringifier(),
    []
  )

  return stringifier
}
