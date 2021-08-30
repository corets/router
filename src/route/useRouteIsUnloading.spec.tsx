import React from "react"
import { useRouteIsUnloading } from "./useRouteIsUnloading"
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import { createTestHistory, Router } from "../router"
import { Route } from "./Route"
import { createTimeout } from "@corets/promise-helpers"
import { useRouteIsVisible } from "./useRouteIsVisible"
import { useRouteUnloader } from "./useRouteUnloader"

describe("useRouteIsUnloading", () => {
  it("tells if route is unloading", async () => {
    const testHistory = createTestHistory("/foo")

    const Test = () => {
      const isUnloading = useRouteIsUnloading()
      const isVisible = useRouteIsVisible()

      useRouteUnloader(() => createTimeout(100))

      return (
        <>
          <div>{isUnloading ? "unloading" : "not unloading"}</div>
          <div>{isVisible ? "visible" : "not visible"}</div>
        </>
      )
    }

    render(
      <Router history={testHistory} unloadable>
        <Route path="/foo">
          <div>foo</div>
          <Test />
        </Route>

        <Route path="/bar">bar</Route>
      </Router>
    )

    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(await screen.findByText("not unloading")).toBeInTheDocument()
    expect(await screen.findByText("visible")).toBeInTheDocument()

    act(() => testHistory.push("/bar"))

    expect(await screen.findByText("unloading")).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.queryByText("foo"))

    expect(await screen.findByText("bar")).toBeInTheDocument()
  })
})
