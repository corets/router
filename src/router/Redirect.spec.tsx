import { render, screen } from "@testing-library/react"
import React from "react"
import { Router } from "./Router"
import { Route } from "../route"
import { Redirect } from "./Redirect"

describe("Redirect", () => {
  it("redirects on to another path", async () => {
    render(
      <Router>
        <Route>
          redirect
          <Redirect to="/bar" />
        </Route>
        <Route path="/bar">bar</Route>
      </Router>
    )

    expect(await screen.findByText("bar")).toBeInTheDocument()
    expect(await screen.findByText("redirect")).toBeInTheDocument()
  })
})
