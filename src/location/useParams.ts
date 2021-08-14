import { MatchedParams } from "../matcher"
import { useContext } from "react"
import { RouteContext } from "../route"
import { UseParams } from "./types"

export const useParams: UseParams = <TParams extends MatchedParams>(
  defaultParams
) => {
  const params = useContext(RouteContext)?.params

  return { ...defaultParams, ...params }
}
