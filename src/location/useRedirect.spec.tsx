import { useRedirect } from "./useRedirect"
import { fireEvent, render, screen } from "@testing-library/react"
import { Router } from "../router"
import React from "react"
import { createTestHistory } from "../router/createTestHistory"

describe("useRedirect", () => {
  it("redirects to a new location", async () => {
    const testHistory = createTestHistory("/")

    const Test = () => {
      const redirect = useRedirect()

      return <button onClick={() => redirect("/foo")}>button</button>
    }

    render(
      <Router history={testHistory}>
        <Test />
      </Router>
    )

    expect(testHistory.location.pathname).toBe("/")

    fireEvent.click(screen.getByText("button"))

    expect(testHistory.location.pathname).toBe("/foo")
  })

  it("respects base path", async () => {
    const testHistory = createTestHistory("/")

    const Test = () => {
      const redirect = useRedirect()

      return (
        <>
          <button onClick={() => redirect("/bar")}>button1</button>
          <button onClick={() => redirect("/bar", { base: "/" })}>
            button2
          </button>
        </>
      )
    }

    render(
      <Router history={testHistory} base="/foo">
        <Test />
      </Router>
    )

    expect(testHistory.location.pathname).toBe("/")

    fireEvent.click(screen.getByText("button1"))

    expect(testHistory.location.pathname).toBe("/foo/bar")

    fireEvent.click(screen.getByText("button2"))

    expect(testHistory.location.pathname).toBe("/bar")
  })
})
