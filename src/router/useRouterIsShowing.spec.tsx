import { render, screen } from "@testing-library/react"
import { Router } from "./Router"
import React from "react"
import { useRouterIsShowing } from "./useRouterIsShowing"

describe("useRouterIsShowing", () => {
  it("returns isShowing from router", async () => {
    const Test = () => {
      const isShowing = useRouterIsShowing()

      return <div>{isShowing.toString()}</div>
    }

    render(
      <Router>
        <Test />
      </Router>
    )

    expect(await screen.findByText("false")).toBeInTheDocument()
  })
})
