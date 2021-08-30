import { render, screen } from "@testing-library/react"
import { Router } from "./Router"
import React from "react"
import { useRouterIsVisible } from "./useRouterIsVisible"

describe("useRouterIsVisible", () => {
  it("returns isVisible from router", async () => {
    const Test = () => {
      const isVisible = useRouterIsVisible()

      return <div>{isVisible.toString()}</div>
    }

    render(
      <Router>
        <Test />
      </Router>
    )

    expect(await screen.findByText("false")).toBeInTheDocument()
  })
})
