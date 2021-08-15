import { render, screen } from "@testing-library/react"
import { Router } from "./Router"
import React from "react"
import { useRouterIsLoading } from "./useRouterIsLoading"

describe("useRouterIsLoading", () => {
  it("returns isLoading from router", async () => {
    const Test = () => {
      const isLoading = useRouterIsLoading()

      return <div>{isLoading.toString()}</div>
    }

    render(
      <Router>
        <Test />
      </Router>
    )

    expect(await screen.findByText("false")).toBeInTheDocument()
  })
})
