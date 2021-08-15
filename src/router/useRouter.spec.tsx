import { useRouter } from "./useRouter"
import React from "react"
import { render, screen } from "@testing-library/react"
import { Router } from "./Router"

describe("useRouter", () => {
  it("reads from the context", async () => {
    const Test = () => {
      const router = useRouter()

      return <div>{router && "yes"}</div>
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
      const router = useRouter()

      return <div>{router && "yes"}</div>
    }

    expect(() => render(<Test />)).toThrow()

    console.error = consoleError
  })
})
