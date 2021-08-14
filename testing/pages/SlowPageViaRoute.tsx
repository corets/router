import React from "react"
import { Counter } from "../components/Counter"
import { UpdateParams } from "../components/UpdateParams"
import { createTimeout } from "@corets/promise-helpers"
import { useAsync } from "@corets/use-async"
import { Route, RouteStatus, useParams, useRoute, useRouteLifeCycle } from "../../src"

export const SlowPageViaRoute = (props: { nested?: boolean }) => {
  const params = useParams()
  const route = useRoute()
  const routeLifeCycle = useRouteLifeCycle()

  useAsync(async () => {
    if (route.status === RouteStatus.Unload) {
      const unloader = routeLifeCycle.createUnloader()

      unloader.start()
      console.log("---unloading")
      await createTimeout(props.nested ? 2000 : 5000)
      console.log("---unloading done")
      unloader.stop()
    }
  }, [route.status])

  useAsync(async () => {
    if (route.status === RouteStatus.Load) {
      const loader = routeLifeCycle.createLoader()

      loader.start()
      console.log("---loading")
      await createTimeout(props.nested ? 2000 : 5000)
      console.log("---loading done")
      loader.stop()
    }
  }, [route.status])

  return (
    <div>
      slow page {JSON.stringify(params)} (from context)
      <br />
      <Counter />
      <br />
      <UpdateParams />
      {props.nested && (
        <Route
          path={`${route.path}/nested`}
          render={() => <SlowPageViaRoute />}
        />
      )}
    </div>
  )
}
