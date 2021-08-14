import { createContext } from "react"
import { ObservableValue } from "@corets/value"
import { RouterRegistry } from "./types"

export const RouterRegistryContext = createContext<
  ObservableValue<RouterRegistry> | undefined
>(undefined)
