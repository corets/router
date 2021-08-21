import React from "react"
import { useRouteIsVisible } from "./useRouteIsVisible"
import { act, render, screen } from "@testing-library/react"
import { Router } from "../router"
import { Route } from "./Route"
import { createTimeout } from "@corets/promise-helpers"

describe("useRouteIsVisible", () => {
  it("tells if route is visible", async () => {
    const Test = () => {
      const isVisible = useRouteIsVisible()

      return <>{isVisible ? "yes" : "no"}</>
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
