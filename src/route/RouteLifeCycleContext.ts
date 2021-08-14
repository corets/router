import { createContext } from "react"
import { RouteLifeCycleHandle } from "./types"

export const RouteLifeCycleContext = createContext<
  RouteLifeCycleHandle | undefined
>(undefined)
