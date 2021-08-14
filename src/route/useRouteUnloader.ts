import { useEffect, useMemo } from "react"
import { useRouteLifeCycle } from "./useRouteLifeCycle"
import { useAsync } from "@corets/use-async"
import { useRoute } from "./useRoute"
import { RouteStatus, UseRouteUnloader } from "./types"

export const useRouteUnloader: UseRouteUnloader = (callback) => {
  const route = useRoute()
  const lifeCycle = useRouteLifeCycle()
  const unloader = useMemo(() => lifeCycle.createUnloader(), [])

  useEffect(() => {
    if (!route.unloadable) {
      console.warn(
        `[Router]: route ${route.path} is trying to use an unloader, but either the route itself nor the router have this feature enabled. You have to set the unloadable flag, for example: <Route unloadable /> or the <Router unloadable />, to enable this feature.`
      )
    }
  }, [])

  useAsync(async () => {
    if (route.status === RouteStatus.Unload && !unloader.isRunning()) {
      unloader.start()

      if (callback) {
        await callback()
        unloader.stop()
      }
    }
  }, [route.status])

  return {
    done: () => unloader.stop(),
    isRunning: () => unloader.isRunning(),
  }
}
