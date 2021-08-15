import React from "react"
import { useParams } from "./useParams"
import { render, screen } from "@testing-library/react"
import { Router } from "../router"
import { Route } from "../route"
import { createTestHistory } from "../router/createTestHistory"

describe("useParams", () => {
  it("uses route params", async () => {
    const Test = () => {
      const params = useParams()

      return <>{JSON.stringify(params)}</>
    }

    render(
      <Router history={createTestHistory("/foo/1")}>
        <Route path="/foo/:bar">
          <Test />
        </Route>
      </Router>
    )

    expect(await screen.findByText(`{"bar":"1"}`)).toBeInTheDocument()
  })
})
