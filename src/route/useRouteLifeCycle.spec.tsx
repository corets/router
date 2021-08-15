import React from "react"
import { render, screen } from "@testing-library/react"
import { Router } from "../router"
import { Route } from "./Route"
import { useRouteLifeCycle } from "./useRouteLifeCycle"

describe("useRouteLifeCycle", () => {
  it("reads context", async () => {
    const Test = () => {
      const lifeCycle = useRouteLifeCycle()

      return <>{lifeCycle && "yes"}</>
    }

    render(
      <Router>
        <Route>
          <Test />
        </Route>
      </Router>
    )

    expect(await screen.findByText("yes")).toBeInTheDocument()
  })

  it("throws if context is empty", async () => {
    const consoleError = console.error
    console.error = jest.fn()

    const Test = () => {
      const lifeCycle = useRouteLifeCycle()

      return <>{lifeCycle && "yes"}</>
    }

    expect(() => {
      render(
        <Router>
          <Test />
        </Router>
      )
    }).toThrow()

    console.error = consoleError
  })
})
