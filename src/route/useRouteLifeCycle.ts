import { useContext } from "react"
import { RouteLifeCycleContext } from "./RouteLifeCycleContext"
import { UseRouteLifeCycle } from "./types"

export const useRouteLifeCycle: UseRouteLifeCycle = () => {
  const lifeCycle = useContext(RouteLifeCycleContext)

  if (!lifeCycle) {
    throw new Error(
      "RouteLifeCycleContext is empty, make sure to wrap your components inside <Route/> ... </Route>"
    )
  }

  return lifeCycle
}
