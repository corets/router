import { createContext } from "react"
import { RouterHandle } from "./types"

export const RouterContext = createContext<RouterHandle | undefined>(undefined)
