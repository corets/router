import { createPromise } from "@corets/promise-helpers"
import React from "react"
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import { createTestHistory, Router } from "../router"
import { Route } from "./Route"
import { useAsync } from "@corets/use-async"
import { useRouteUnloader } from "./useRouteUnloader"
import { useRouteStatus } from "./useRouteStatus"
import { RouteStatus } from "./types"

describe("useRouteUnloader", () => {
  it("uses an async route unloader", async () => {
    const promise = createPromise()
    const testHistory = createTestHistory("/foo")

    const Test = () => {
      const unloader = useRouteUnloader(() => promise)

      if (unloader.isRunning()) {
        return <div>unloading</div>
      }

      return <div>foo</div>
    }

    render(
      <Router history={testHistory}>
        <Route unloadable controlled path="/foo">
          <Test />
        </Route>
        <Route path="/bar">bar</Route>
      </Router>
    )

    expect(await screen.findByText("foo")).toBeInTheDocument()

    act(() => testHistory.push("/bar"))

    expect(await screen.findByText("unloading")).toBeInTheDocument()

    act(() => promise.resolve())

    await waitForElementToBeRemoved(() => screen.queryByText("unloading"))

    expect(await screen.findByText("bar")).toBeInTheDocument()
  })

  it("uses a controlled route loader", async () => {
    const promise = createPromise()
    const testHistory = createTestHistory("/foo")

    const Test = () => {
      const status = useRouteStatus()
      const unloader = useRouteUnloader()

      useAsync(async () => {
        if (status === RouteStatus.Unload) {
          await promise

          unloader.done()
        }
      }, [status])

      if (unloader.isRunning()) {
        return <div>unloading</div>
      }

      return <div>foo</div>
    }

    render(
      <Router history={testHistory}>
        <Route unloadable controlled path="/foo">
          <Test />
        </Route>
        <Route path="/bar">bar</Route>
      </Router>
    )

    expect(await screen.findByText("foo")).toBeInTheDocument()

    act(() => testHistory.push("/bar"))

    expect(await screen.findByText("unloading")).toBeInTheDocument()

    act(() => promise.resolve())

    await waitForElementToBeRemoved(() => screen.queryByText("unloading"))

    expect(await screen.findByText("bar")).toBeInTheDocument()
  })

  it("uses nested unloaders", async () => {
    const promise1 = createPromise()
    const promise2 = createPromise()
    const testHistory = createTestHistory("/foo")

    const Test1 = () => {
      const unloader = useRouteUnloader(() => promise1)

      return <div>{unloader.isRunning() ? "unloading1" : "done1"}</div>
    }

    const Test2 = () => {
      const unloader = useRouteUnloader(() => promise2)

      return <div>{unloader.isRunning() ? "unloading2" : "done2"}</div>
    }

    render(
      <Router history={testHistory} unloadable>
        <Route path="/foo">
          <Test1 />
          <Route>
            <Test2 />
          </Route>
        </Route>
        <Route path="/bar">bar</Route>
      </Router>
    )

    expect(await screen.findByText("done1")).toBeInTheDocument()
    expect(await screen.findByText("done2")).toBeInTheDocument()

    act(() => testHistory.push("/bar"))

    expect(await screen.findByText("unloading1")).toBeInTheDocument()
    expect(await screen.findByText("unloading2")).toBeInTheDocument()

    act(() => promise1.resolve())

    expect(await screen.findByText("unloading1")).toBeInTheDocument()
    expect(await screen.findByText("unloading2")).toBeInTheDocument()

    act(() => promise2.resolve())

    expect(await screen.findByText("bar")).toBeInTheDocument()
    expect(screen.queryByText("unloading1")).toBe(null)
    expect(screen.queryByText("unloading2")).toBe(null)
    expect(screen.queryByText("done1")).toBe(null)
    expect(screen.queryByText("done2")).toBe(null)
  })
})
