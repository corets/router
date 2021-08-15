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

describe("useRouteIsUnloading", () => {
  it("tells if route is unloading", async () => {
    const testHistory = createTestHistory("/foo")

    const Test = () => {
      const isUnloading = useRouteIsUnloading()

      return <>{isUnloading ? "yes" : "no"}</>
    }

    render(
      <Router history={testHistory}>
        <Route path="/foo">
          <div>foo</div>
          <Test />
        </Route>

        <Route path="/bar">bar</Route>
      </Router>
    )

    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(await screen.findByText("no")).toBeInTheDocument()

    await act(() => createTimeout(10))

    expect(await screen.findByText("no")).toBeInTheDocument()

    act(() => {
      testHistory.push("/bar")
    })

    expect(await screen.findByText("yes")).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.queryByText("foo"))

    expect(await screen.findByText("bar")).toBeInTheDocument()
  })
})
