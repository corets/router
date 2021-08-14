import React from "react"
import { Counter } from "../components/Counter"
import { UpdateParams } from "../components/UpdateParams"
import { createTimeout } from "@corets/promise-helpers"
import { useAsync } from "@corets/use-async"
import { RouteStatus, useParams, useRoute, useRouteIsLoading, useRouteIsUnloading, useRouteLoader, useRouteUnloader } from "../../src"

export const SlowControlledPage = () => {
  const params = useParams()
  const route = useRoute()
  const isLoading = useRouteIsLoading()
  const isUnloading = useRouteIsUnloading()

  const routeLoader = useRouteLoader()
  const routeUnloader = useRouteUnloader()

  useAsync(async () => {
    await createTimeout(2000)
    routeLoader.done()
  }, [])

  useAsync(async () => {
    if (route.status === RouteStatus.Unload) {
      await createTimeout(2000)
      routeUnloader.done()
    }
  }, [route.status])

  if (isLoading) {
    return (
      <div style={{ background: "purple", color: "white", padding: 10 }}>
        loading
      </div>
    )
  }

  if (isUnloading) {
    return (
      <div style={{ background: "green", color: "white", padding: 10 }}>
        unloading
      </div>
    )
  }

  return (
    <div>
      slow page {JSON.stringify(params)} (from context)
      <br />
      <Counter />
      <br />
      <UpdateParams />
    </div>
  )
}
