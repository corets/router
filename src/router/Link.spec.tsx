import React from "react"
import { Route } from "../route"
import { Link } from "./Link"
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import { Router } from "./Router"
import { createStaticHistory } from "./helpers/createStaticHistory"

describe("Link", () => {
  it("triggers a redirect", async () => {
    const Test = () => {
      return (
        <>
          <Link to="/foo">link</Link>
          <Route path="/foo">foo</Route>
          <Route exact>bar</Route>
        </>
      )
    }

    render(
      <Router>
        <Test />
      </Router>
    )

    expect(await screen.findByText("link")).toBeInTheDocument()
    expect(await screen.findByText("bar")).toBeInTheDocument()

    expect(screen.getByText("link")).toHaveAttribute("data-matches", "false")

    fireEvent.click(screen.getByText("link"))

    await waitForElementToBeRemoved(() => screen.queryByText("bar"))

    expect(await screen.findByText("foo")).toBeInTheDocument()

    expect(screen.getByText("link")).toHaveAttribute("data-matches", "true")
  })

  it("respects exact prop to determine if it matches", async () => {
    render(
      <Router history={createStaticHistory("/foo")}>
        <Link to="/">link1</Link>
        <Link to="/" exact>
          link2
        </Link>
      </Router>
    )

    expect(await screen.findByText("link1")).toBeInTheDocument()
    expect(await screen.findByText("link2")).toBeInTheDocument()

    expect(screen.getByText("link1")).toHaveAttribute("data-matches", "true")
    expect(screen.getByText("link2")).toHaveAttribute("data-matches", "false")
  })
})
