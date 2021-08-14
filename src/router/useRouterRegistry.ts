import { useContext } from "react"
import { UseRouterRegistry } from "./types"
import { RouterRegistryContext } from "./RouterRegistryContext"

export const useRouterRegistry: UseRouterRegistry = () => {
  const registry = useContext(RouterRegistryContext)

  if (!registry) {
    throw new Error(
      "RouterRegistryContext is empty, make sure to wrap your components inside <Router/> ... </Router>"
    )
  }

  return registry
}
