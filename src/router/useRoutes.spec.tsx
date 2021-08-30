import { render, screen } from "@testing-library/react"
import React from "react"
import { Router } from "./Router"
import { Route } from "../route"
import { useRoutes } from "./useRoutes"
import { RouterRegistry } from "./types"

describe("useRoutes", () => {
  it("returns routes", async () => {
    let routes: RouterRegistry

    const Test = () => {
      routes = useRoutes()
      return null
    }

    render(
      <Router>
        <Route path="/foo">foo</Route>
        <Route path="/bar">bar</Route>

        <Route>
          <div>test</div>
          <Test />
        </Route>
      </Router>
    )

    expect(await screen.findByText("test")).toBeInTheDocument()
    expect(routes!).toBeDefined()
    expect(Object.values(routes!).length).toBe(3)
    expect(routes![0].path).toBe("/foo")
    expect(routes![1].path).toBe("/bar")
    expect(routes![2].path).toBe("/")
  })
})
