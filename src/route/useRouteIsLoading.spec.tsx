import React from "react"
import { useRouteIsLoading } from "./useRouteIsLoading"
import { act, render, screen } from "@testing-library/react"
import { Router } from "../router"
import { Route } from "./Route"
import { createTimeout } from "@corets/promise-helpers"

describe("useRouteIsLoading", () => {
  it("tells if route is loading", async () => {
    const Test = () => {
      const isLoading = useRouteIsLoading()

      return <>{isLoading ? "yes" : "no"}</>
    }

    render(
      <Router>
        <Route>
          <Test />
        </Route>
      </Router>
    )

    expect(await screen.findByText("yes")).toBeInTheDocument()

    await act(() => createTimeout(10))

    expect(await screen.findByText("no")).toBeInTheDocument()
  })
})
