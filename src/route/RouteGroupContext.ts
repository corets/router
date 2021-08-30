import { createContext } from "react"
import { RouteGroupHandle } from "./types"

export const RouteGroupContext = createContext<RouteGroupHandle | undefined>(
  undefined
)
