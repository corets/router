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

    expect(screen.getByText("link")).toHaveAttribute("href", "/foo")
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

  it("respects the base prop", async () => {
    const history = createStaticHistory("/foo")

    render(
      <Router history={history} base="/foo">
        <Link to="/">link1</Link>
        <Link to="/bar">link2</Link>
        <Link to="/bar" base="/">
          link3
        </Link>
      </Router>
    )

    expect(screen.getByText("link1")).toHaveAttribute("href", "/foo")
    expect(screen.getByText("link2")).toHaveAttribute("href", "/foo/bar")
    expect(screen.getByText("link3")).toHaveAttribute("href", "/bar")

    expect(screen.getByText("link1")).toHaveAttribute("data-matches", "true")
    expect(screen.getByText("link2")).toHaveAttribute("data-matches", "false")
    expect(screen.getByText("link3")).toHaveAttribute("data-matches", "false")

    fireEvent.click(screen.getByText("link2"))

    expect(screen.getByText("link1")).toHaveAttribute("data-matches", "true")
    expect(screen.getByText("link2")).toHaveAttribute("data-matches", "true")
    expect(screen.getByText("link3")).toHaveAttribute("data-matches", "false")

    expect(history.location.pathname).toBe("/foo/bar")

    fireEvent.click(screen.getByText("link3"))

    expect(screen.getByText("link1")).toHaveAttribute("data-matches", "false")
    expect(screen.getByText("link2")).toHaveAttribute("data-matches", "false")
    expect(screen.getByText("link3")).toHaveAttribute("data-matches", "true")

    expect(history.location.pathname).toBe("/bar")
  })

  it("intercepts clicks", async () => {
    const history = createStaticHistory("/")

    const windowLocation = window.location
    window.location = { pathname: "/" } as any

    render(
      <Router history={history}>
        <Link to="/foo">link1</Link>
        <Link to="/bar" intercept={false}>
          link2
        </Link>
        <Link to="/bar">link3</Link>
        <Link to="/bar" target="_blank">
          link4
        </Link>
        <Link to="/bar" target="_parent">
          link5
        </Link>
        <Link to="/bar" target="_top">
          link6
        </Link>
        <Link to="/bar" target="_self">
          link7
        </Link>
      </Router>
    )

    expect(history.location.pathname).toBe("/")

    fireEvent.click(screen.getByText("link1"))

    expect(history.location.pathname).toBe("/foo")

    fireEvent.click(screen.getByText("link2"))

    // should not change, event is handled by the window
    expect(history.location.pathname).toBe("/foo")

    fireEvent.click(screen.getByText("link3"), { ctrlKey: true })

    // should not change, event is handled by the window
    expect(history.location.pathname).toBe("/foo")

    fireEvent.click(screen.getByText("link3"), { metaKey: true })

    // should not change, event is handled by the window
    expect(history.location.pathname).toBe("/foo")

    fireEvent.click(screen.getByText("link3"), { altKey: true })

    // should not change, event is handled by the window
    expect(history.location.pathname).toBe("/foo")

    fireEvent.click(screen.getByText("link4"))

    // should not change, event is handled by the window
    expect(history.location.pathname).toBe("/foo")

    fireEvent.click(screen.getByText("link5"))

    // should not change, event is handled by the window
    expect(history.location.pathname).toBe("/foo")

    fireEvent.click(screen.getByText("link6"))

    // should not change, event is handled by the window
    expect(history.location.pathname).toBe("/foo")

    fireEvent.click(screen.getByText("link7"))

    expect(history.location.pathname).toBe("/bar")

    window.location = windowLocation
  })
})
