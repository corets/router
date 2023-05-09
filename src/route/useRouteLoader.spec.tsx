import { useRouteLoader } from "./useRouteLoader"
import { createPromise, createTimeout } from "@corets/promise-helpers"
import React, { useState } from "react"
import { act, render, screen } from "@testing-library/react"
import { Router, useRouter, createTestHistory } from "../router"
import { Route } from "./Route"
import { useAsync } from "@corets/use-async"

describe("useRouteLoader", () => {
  it("uses an async route loader", async () => {
    const promise = createPromise()

    const Test = () => {
      const loader = useRouteLoader(() => promise)

      if (loader.isRunning()) {
        return <div>loading</div>
      }

      return <div>done</div>
    }

    render(
      <Router>
        <Route loadable controlled>
          <Test />
        </Route>
      </Router>
    )

    expect(await screen.findByText("loading")).toBeInTheDocument()

    act(() => promise.resolve())

    expect(await screen.findByText("done")).toBeInTheDocument()
  })

  it("uses an async route loader with an unloader", async () => {
    const testHistory = createTestHistory("/foo")
    const loaderPromise = createPromise()
    const unloaderPromise = createPromise()

    const Test = () => {
      const [isUnloading, setIsUnloading] = useState(false)

      const loader = useRouteLoader(async () => {
        await loaderPromise

        return async () => {
          setIsUnloading(true)

          await unloaderPromise

          setIsUnloading(false)
        }
      })

      if (loader.isRunning()) {
        return <div>loading</div>
      }

      if (isUnloading) {
        return <div>unloading</div>
      }

      return <div>done</div>
    }

    render(
      <Router history={testHistory}>
        <Route loadable unloadable controlled path="/foo">
          <Test />
        </Route>
        <Route path="/bar">bar</Route>
      </Router>
    )

    expect(await screen.findByText("loading")).toBeInTheDocument()

    act(() => loaderPromise.resolve())

    expect(await screen.findByText("done")).toBeInTheDocument()

    act(() => testHistory.push("/bar"))

    expect(await screen.findByText("unloading")).toBeInTheDocument()

    act(() => unloaderPromise.resolve())

    expect(await screen.findByText("bar")).toBeInTheDocument()
  })

  it("uses a controlled route loader", async () => {
    const promise = createPromise()

    const Test = () => {
      const loader = useRouteLoader()

      useAsync(async () => {
        await promise

        loader.done()
      })

      if (loader.isRunning()) {
        return <div>loading</div>
      }

      return <div>done</div>
    }

    render(
      <Router>
        <Route loadable controlled>
          <Test />
        </Route>
      </Router>
    )

    expect(await screen.findByText("loading")).toBeInTheDocument()

    act(() => promise.resolve())

    expect(await screen.findByText("done")).toBeInTheDocument()
  })

  it("uses nested loaders", async () => {
    const promise1 = createPromise()
    const promise2 = createPromise()

    const Test1 = () => {
      useRouteLoader(() => promise1)

      const router = useRouter()

      return <div>{router.isLoading() ? "loading1" : "done1"}</div>
    }

    const Test2 = () => {
      useRouteLoader(() => promise2)

      const router = useRouter()

      return <div>{router.isLoading() ? "loading2" : "done2"}</div>
    }

    render(
      <Router loadable>
        <Route>
          <Test1 />
          <Route>
            <Test2 />
          </Route>
        </Route>
      </Router>
    )

    expect(await screen.findByText("loading1")).toBeInTheDocument()
    expect(await screen.findByText("loading2")).toBeInTheDocument()

    act(() => promise1.resolve())

    expect(await screen.findByText("loading1")).toBeInTheDocument()
    expect(await screen.findByText("loading2")).toBeInTheDocument()

    act(() => promise2.resolve())

    expect(await screen.findByText("done1")).toBeInTheDocument()
    expect(await screen.findByText("done2")).toBeInTheDocument()
  })
})
