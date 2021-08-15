import React from "react"
import { useHistory } from "./useHistory"
import { render, screen } from "@testing-library/react"
import { Router } from "../router"
import { createTestHistory } from "../router/createTestHistory"

describe("useHistory", () => {
  it("uses history", async () => {
    const Test = () => {
      const history = useHistory()

      return <>{history && "yes"}</>
    }

    render(<Test />)

    expect(await screen.findByText("yes")).toBeInTheDocument()
  })

  it("uses history from router", async () => {
    const testHistory = createTestHistory("/")

    const Test = () => {
      const history = useHistory()

      return <>{history === testHistory && "yes"}</>
    }

    render(
      <Router history={testHistory}>
        <Test />
      </Router>
    )

    expect(await screen.findByText("yes")).toBeInTheDocument()
  })
})
