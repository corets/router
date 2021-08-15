import { render, screen } from "@testing-library/react"
import { Router } from "./Router"
import React from "react"
import { useRouterIsUnloading } from "./useRouterIsUnloading"

describe("useRouterIsUnloading", () => {
  it("returns isUnloading from router", async () => {
    const Test = () => {
      const isUnloading = useRouterIsUnloading()

      return <div>{isUnloading.toString()}</div>
    }

    render(
      <Router>
        <Test />
      </Router>
    )

    expect(await screen.findByText("false")).toBeInTheDocument()
  })
})
