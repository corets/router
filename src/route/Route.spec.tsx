import {
  act,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import { createTestHistory, Router } from "../router"
import React, { useContext } from "react"
import { Route } from "./Route"
import { RouteContext } from "./RouteContext"

describe("Route", () => {
  it("renders an element from children", async () => {
    render(
      <Router>
        <Route>
          <div>content</div>
        </Route>
      </Router>
    )

    expect(await screen.findByText("content")).toBeInTheDocument()
  })

  it("renders multiple elements from children", async () => {
    render(
      <Router>
        <Route>
          <div>content1</div>
          <div>content2</div>
        </Route>
      </Router>
    )

    expect(await screen.findByText("content1")).toBeInTheDocument()
    expect(await screen.findByText("content2")).toBeInTheDocument()
  })

  it("renders a fragment from children", async () => {
    render(
      <Router>
        <Route>
          <>content</>
        </Route>
      </Router>
    )

    expect(await screen.findByText("content")).toBeInTheDocument()
  })

  it("renders a text from children", async () => {
    render(
      <Router>
        <Route>content</Route>
      </Router>
    )

    expect(await screen.findByText("content")).toBeInTheDocument()
  })

  it("renders a component from children", async () => {
    render(
      <Router>
        <Route>{() => <div>content</div>}</Route>
      </Router>
    )

    expect(await screen.findByText("content")).toBeInTheDocument()
  })

  it("renders an element from renderer", async () => {
    render(
      <Router>
        <Route render={() => <div>content</div>} />
      </Router>
    )

    expect(await screen.findByText("content")).toBeInTheDocument()
  })

  it("renders an element as renderer", async () => {
    render(
      <Router>
        <Route render={<div>content</div>} />
      </Router>
    )

    expect(await screen.findByText("content")).toBeInTheDocument()
  })

  it("renders a fragment from renderer", async () => {
    render(
      <Router>
        <Route render={() => <>content</>} />
      </Router>
    )

    expect(await screen.findByText("content")).toBeInTheDocument()
  })

  it("renders an element from a sync loader", async () => {
    render(
      <Router>
        <Route load={() => <div>content</div>} />
      </Router>
    )

    expect(await screen.findByText("content")).toBeInTheDocument()
  })

  it("renders an element from an async loader", async () => {
    render(
      <Router>
        <Route load={async () => <div>content</div>} />
      </Router>
    )

    expect(await screen.findByText("content")).toBeInTheDocument()
  })

  it("renders a fragment from a sync loader", async () => {
    render(
      <Router>
        <Route load={() => <>content</>} />
      </Router>
    )

    expect(await screen.findByText("content")).toBeInTheDocument()
  })

  it("renders a fragment from an async loader", async () => {
    render(
      <Router>
        <Route load={async () => <>content</>} />
      </Router>
    )

    expect(await screen.findByText("content")).toBeInTheDocument()
  })

  it("renders a component from a sync loader", async () => {
    const Component = () => <div>content</div>

    render(
      <Router>
        <Route load={() => Component} />
      </Router>
    )

    expect(await screen.findByText("content")).toBeInTheDocument()
  })

  it("renders a fragment from an async loader", async () => {
    const Component = () => <div>content</div>

    render(
      <Router>
        <Route load={async () => Component} />
      </Router>
    )

    expect(await screen.findByText("content")).toBeInTheDocument()
  })

  it("renders nested routes", async () => {
    render(
      <Router>
        <Route>
          <div>content1</div>
          <Route>
            <div>content2</div>
          </Route>
        </Route>
      </Router>
    )

    expect(await screen.findByText("content1")).toBeInTheDocument()
    expect(await screen.findByText("content2")).toBeInTheDocument()
  })

  it("renders nested routes with correct sub paths", async () => {
    const testHistory = createTestHistory("/foo")

    render(
      <Router history={testHistory}>
        <Route path="/foo">
          <div>content1</div>
          <Route path="/bar">
            <div>content2</div>
          </Route>
        </Route>
      </Router>
    )

    expect(await screen.findByText("content1")).toBeInTheDocument()
    expect(screen.queryByText("content2")).toBe(null)

    act(() => testHistory.push("/foo/bar"))

    expect(await screen.findByText("content1")).toBeInTheDocument()
    expect(await screen.findByText("content2")).toBeInTheDocument()
  })

  it("redirects to another route", async () => {
    const testHistory = createTestHistory("/foo")

    const Test = () => {
      const route = useContext(RouteContext)!

      const handleClick = () => route.redirect("/bar")

      return (
        <>
          foo
          <button onClick={handleClick}>redirect</button>
        </>
      )
    }

    render(
      <Router history={testHistory}>
        <Route path="/foo">
          <Test />
        </Route>
        <Route path="/bar">bar</Route>
      </Router>
    )

    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(screen.queryByText("bar")).toBe(null)

    fireEvent.click(screen.getByText("redirect"))

    await waitForElementToBeRemoved(() => screen.queryByText("foo"))

    expect(await screen.findByText("bar")).toBeInTheDocument()
  })

  it("redirects and respects the base path", async () => {
    const testHistory = createTestHistory("/foo")

    const Test = () => {
      const route = useContext(RouteContext)!

      const handleClick1 = () => route.redirect("/bar")
      const handleClick2 = () => route.redirect("/bar", { base: "/" })

      return (
        <>
          <button onClick={handleClick1}>redirect1</button>
          <button onClick={handleClick2}>redirect2</button>
        </>
      )
    }

    render(
      <Router history={testHistory} base="/foo">
        <Route>
          <Test />
        </Route>
      </Router>
    )

    expect(await screen.findByText("redirect1")).toBeInTheDocument()
    expect(await screen.findByText("redirect2")).toBeInTheDocument()

    fireEvent.click(screen.getByText("redirect1"))

    expect(testHistory.location.pathname).toBe("/foo/bar")

    fireEvent.click(screen.getByText("redirect2"))

    expect(testHistory.location.pathname).toBe("/bar")
  })
})
