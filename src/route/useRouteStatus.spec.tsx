import React from "react"
import { useRouteStatus } from "./useRouteStatus"
import { render, screen } from "@testing-library/react"
import { Router } from "../router"
import { Route } from "./Route"
import { RouteStatus } from "./types"

describe("useRouteStatus", () => {
  it("returns route status", async () => {
    const Test = () => {
      const status = useRouteStatus()

      return <>{status}</>
    }

    render(
      <Router>
        <Route>
          <Test />
        </Route>
      </Router>
    )

    expect(await screen.findByText(RouteStatus.Show)).toBeInTheDocument()
  })
})
