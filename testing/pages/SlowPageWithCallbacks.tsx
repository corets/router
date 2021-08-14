import React from "react"
import { Counter } from "../components/Counter"
import { UpdateParams } from "../components/UpdateParams"
import { createTimeout } from "@corets/promise-helpers"
import { Route, useParams, useRoute, useRouteLoader, useRouteUnloader } from "../../src"

export const SlowPageWithCallbacks = (props: { nested?: boolean }) => {
  const params = useParams()
  const route = useRoute()

  useRouteUnloader(async () => {
    await createTimeout(props.nested ? 2000 : 5000)
  })

  useRouteLoader(async () => {
    await createTimeout(props.nested ? 2000 : 5000)
  })

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
          render={() => <SlowPageWithCallbacks />}
        />
      )}
    </div>
  )
}
