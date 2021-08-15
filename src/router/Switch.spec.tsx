import { render, screen } from "@testing-library/react"
import React from "react"
import { Router } from "./Router"
import { Route } from "../route"
import { Switch } from "./Switch"

describe("Switch", () => {
  it("renders one of the routes", async () => {
    render(
      <Router>
        <Switch>
          <Route>foo</Route>
          <Route>bar</Route>
        </Switch>
      </Router>
    )

    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(screen.queryByText("bar")).toBe(null)
  })

  it("renders nested switches accordingly", async () => {
    render(
      <Router>
        <Switch>
          <Route>
            switch1
            <Switch>
              <Route>switch11</Route>
              <Route>switch12</Route>
            </Switch>
            <Route>switch13</Route>
          </Route>
          <Route>switch2</Route>
        </Switch>
      </Router>
    )

    expect(await screen.findByText("switch1")).toBeInTheDocument()
    expect(await screen.findByText("switch11")).toBeInTheDocument()
    expect(await screen.findByText("switch13")).toBeInTheDocument()
    expect(screen.queryByText("switch12")).toBe(null)
    expect(screen.queryByText("switch2")).toBe(null)
  })
})
