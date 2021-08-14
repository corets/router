import { createContext } from "react"
import { RouteHandle } from "./types"

export const RouteContext = createContext<RouteHandle | undefined>(undefined)
