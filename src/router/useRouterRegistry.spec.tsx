import { render, screen } from "@testing-library/react"
import { Router } from "./Router"
import React from "react"
import { useRouterRegistry } from "./useRouterRegistry"

describe("useRouterRegistry", () => {
  it("reads from the context", async () => {
    const Test = () => {
      const registry = useRouterRegistry()

      return <div>{registry && "yes"}</div>
    }

    render(
      <Router>
        <Test />
      </Router>
    )

    expect(await screen.findByText("yes")).toBeInTheDocument()
  })

  it("throws an error if context is empty", async () => {
    const consoleError = console.error
    console.error = jest.fn()

    const Test = () => {
      const registry = useRouterRegistry()

      return <div>{registry && "yes"}</div>
    }

    expect(() => render(<Test />)).toThrow()

    console.error = consoleError
  })
})
