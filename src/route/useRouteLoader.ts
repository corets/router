import { useAsync } from "@corets/use-async"
import { useRouteLifeCycle } from "./useRouteLifeCycle"
import { useEffect, useMemo, useRef } from "react"
import { useRoute } from "./useRoute"
import { RouteStatus, UseRouteLoader } from "./types"
import { useRouteUnloader } from "./useRouteUnloader"

export const useRouteLoader: UseRouteLoader = (callback) => {
  const route = useRoute()
  const lifeCycle = useRouteLifeCycle()
  const loader = useMemo(() => lifeCycle.createLoader(), [])
  const maybeUnloaderCallbackRef = useRef<
    (() => void) | (() => Promise<void>) | void
  >()

  useEffect(() => {
    if (!route.loadable) {
      console.warn(
        `[Router]: route ${route.path} is trying to use a loader, but either the route itself nor the router have this feature enabled. You have to set the loadable flag, for example: <Route loadable /> or the <Router loadable />, to enable this feature.`
      )
    }

    return () => loader.stop()
  }, [])

  useRouteUnloader(async () => {
    if (maybeUnloaderCallbackRef.current) {
      await maybeUnloaderCallbackRef.current()
    }
  })

  useAsync(async () => {
    if (route.status === RouteStatus.Load && !loader.isRunning()) {
      loader.start()

      if (callback) {
        maybeUnloaderCallbackRef.current = await callback()

        loader.stop()
      }
    }
  }, [route.status])

  return {
    done: () => loader.stop(),
    isRunning: () => loader.isRunning(),
  }
}
