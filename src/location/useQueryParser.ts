import { useContext, useMemo } from "react"
import { RouterContext } from "../router"
import { UseQueryParser } from "./types"
import { createQueryParser } from "./createQueryParser"

export const useQueryParser: UseQueryParser = (queryParser) => {
  const router = useContext(RouterContext)
  const parser = useMemo(
    () => queryParser ?? router?.queryParser ?? createQueryParser(),
    []
  )

  return parser
}
