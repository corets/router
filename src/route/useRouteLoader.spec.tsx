import { useRouteLoader } from "./useRouteLoader"
import { createPromise } from "@corets/promise-helpers"
import React from "react"
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import { Router, useRouter } from "../router"
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
