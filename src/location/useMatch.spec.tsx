import React from "react"
import { useMatch } from "./useMatch"
import { render, screen } from "@testing-library/react"
import { Router } from "../router"
import { createTestHistory } from "../router/createTestHistory"

describe("useMatch", () => {
  it("matches a path", async () => {
    const testHistory = createTestHistory("/foo/1")

    const Test = () => {
      const [matches, params] = useMatch("/foo/:bar")

      return <>{JSON.stringify({ matches, params })}</>
    }

    render(
      <Router history={testHistory}>
        <Test />
      </Router>
    )

    expect(
      await screen.findByText(`{"matches":true,"params":{"bar":"1"}}`)
    ).toBeInTheDocument()
  })
})
