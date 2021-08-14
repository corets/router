import React from "react"
import { Counter } from "../components/Counter"
import { UpdateParams } from "../components/UpdateParams"
import { createTimeout } from "@corets/promise-helpers"
import { useAsync } from "@corets/use-async"
import { Route, RouteStatus, useParams, useRoute, useRouteLoader, useRouteUnloader } from "../../src"

export const SlowPage = (props: { nested?: boolean }) => {
  const params = useParams()
  const route = useRoute()

  const routeLoader = useRouteLoader()
  const routeUnloader = useRouteUnloader()

  useAsync(async () => {
    await createTimeout(props.nested ? 2000 : 5000)
    routeLoader.done()
  }, [])

  useAsync(async () => {
    if (route.status === RouteStatus.Unload) {
      await createTimeout(props.nested ? 2000 : 5000)
      routeUnloader.done()
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
        <Route path={`${route.path}/nested`} render={() => <SlowPage />} />
      )}
    </div>
  )
}
