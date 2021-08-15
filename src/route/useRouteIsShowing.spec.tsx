import React from "react"
import { useRouteIsShowing } from "./useRouteIsShowing"
import { act, render, screen } from "@testing-library/react"
import { Router } from "../router"
import { Route } from "./Route"
import { createTimeout } from "@corets/promise-helpers"

describe("useRouteIsShowing", () => {
  it("tells if route is showing", async () => {
    const Test = () => {
      const isShowing = useRouteIsShowing()

      return <>{isShowing ? "yes" : "no"}</>
    }

    render(
      <Router>
        <Route>
          <Test />
        </Route>
      </Router>
    )

    expect(await screen.findByText("no")).toBeInTheDocument()

    await act(() => createTimeout(10))

    expect(await screen.findByText("yes")).toBeInTheDocument()
  })
})
