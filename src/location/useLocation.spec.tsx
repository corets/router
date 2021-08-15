import React from "react"
import { useLocation } from "./useLocation"
import { render, screen } from "@testing-library/react"
import { createTestHistory } from "../router/createTestHistory"
import { Router } from "../router"

describe("useLocation", () => {
  it("returns location", async () => {
    const Test = () => {
      const location = useLocation()

      return <>{location.pathname}</>
    }

    render(<Test />)

    expect(await screen.findByText("/")).toBeInTheDocument()
  })

  it("returns location from router", async () => {
    const testHistory = createTestHistory("/foo")

    const Test = () => {
      const location = useLocation()

      return <>{location.pathname}</>
    }

    render(
      <Router history={testHistory}>
        <Test />
      </Router>
    )

    expect(await screen.findByText("/foo")).toBeInTheDocument()
  })
})
