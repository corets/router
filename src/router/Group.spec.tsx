import { render, screen } from "@testing-library/react"
import { Router } from "./Router"
import React from "react"
import { Group } from "./Group"
import { Route } from "../route"
import { Switch } from "./Switch"

describe("Group", () => {
  it("renders routes", async () => {
    render(
      <Router>
        <Group>
          <Route>foo</Route>
          <Route>bar</Route>
        </Group>
      </Router>
    )

    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(await screen.findByText("bar")).toBeInTheDocument()
  })

  it("does not render disabled routes", async () => {
    render(
      <Router>
        <Group>
          <Route>foo</Route>
        </Group>
        <Group disabled>
          <Route>bar</Route>
        </Group>
      </Router>
    )

    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(screen.queryByText("bar")).toBe(null)
  })

  it("can be used to disable routes inside a Switch", async () => {
    render(
      <Router>
        <Switch>
          <Group disabled>
            <Route>foo</Route>

            <Switch>
              <Route>foo</Route>
            </Switch>
          </Group>

          <Route>bar</Route>
        </Switch>
      </Router>
    )

    expect(await screen.findByText("bar")).toBeInTheDocument()
    expect(screen.queryByText("foo")).toBe(null)
  })
})
