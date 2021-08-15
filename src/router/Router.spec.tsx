import React, { useContext } from "react"
import {
  act,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import { Router } from "./Router"
import { RouterContext } from "./RouterContext"
import { RouterRegistryContext } from "./RouterRegistryContext"
import { createStaticHistory } from "./helpers/createStaticHistory"
import { Route } from "../route"

describe("Router", () => {
  it("exposes a router handle trough the RouterContext", async () => {
    const Test = () => {
      const router = useContext(RouterContext)

      return <div>{router && "yes"}</div>
    }

    render(
      <Router>
        <Test />
      </Router>
    )

    expect(await screen.findByText("yes")).toBeInTheDocument()
  })

  it("exposes a router registry trough the RouterContext", async () => {
    const Test = () => {
      const router = useContext(RouterRegistryContext)

      return <div>{router && "yes"}</div>
    }

    render(
      <Router>
        <Test />
      </Router>
    )

    expect(await screen.findByText("yes")).toBeInTheDocument()
  })

  it("renders all routes that match the current path", async () => {
    const Test = () => {
      return (
        <Router history={createStaticHistory("/foo")}>
          <Route path="/foo">foo</Route>
          <Route path="/foo">bar</Route>
          <Route path="/404">baz</Route>
        </Router>
      )
    }

    render(<Test />)

    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(await screen.findByText("bar")).toBeInTheDocument()
    expect(screen.queryByText("baz")).toBe(null)
  })

  it("always renders routes without a path", async () => {
    const Test = () => {
      return (
        <Router history={createStaticHistory("/foo")}>
          <Route>foo</Route>
        </Router>
      )
    }

    render(<Test />)

    expect(await screen.findByText("foo")).toBeInTheDocument()
  })

  it("re-renders when location changes", async () => {
    const history = createStaticHistory("/foo")

    const Test = () => {
      return (
        <Router history={history} wait={0}>
          <Route path="/foo">foo</Route>
          <Route path="/bar">bar</Route>
        </Router>
      )
    }

    render(<Test />)

    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(screen.queryByText("bar")).toBe(null)

    act(() => history.push("/bar"))

    expect(await screen.findByText("bar")).toBeInTheDocument()
    expect(screen.queryByText("foo")).toBe(null)
  })

  it("renders nested routes", async () => {
    const history = createStaticHistory("/foo")

    const Test = () => {
      return (
        <Router history={history} wait={0}>
          <Route path="/foo">
            foo
            <Route path="/foo/bar">bar</Route>
          </Route>
          <Route path="/baz">baz</Route>
        </Router>
      )
    }

    render(<Test />)

    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(screen.queryByText("bar")).toBe(null)
    expect(screen.queryByText("baz")).toBe(null)

    act(() => history.push("/foo/bar"))

    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(await screen.findByText("bar")).toBeInTheDocument()
    expect(screen.queryByText("baz")).toBe(null)

    act(() => history.push("/baz"))

    expect(await screen.findByText("baz")).toBeInTheDocument()
    expect(screen.queryByText("foo")).toBe(null)
    expect(screen.queryByText("bar")).toBe(null)

    act(() => history.push("/foo/bar"))

    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(await screen.findByText("bar")).toBeInTheDocument()
    expect(screen.queryByText("baz")).toBe(null)
  })

  it("respects base path", async () => {
    const history = createStaticHistory("/")

    const Test = () => {
      return (
        <Router history={history} base="/base">
          <Route path="/foo">foo</Route>
          <Route>bar</Route>
        </Router>
      )
    }

    render(<Test />)

    expect(screen.queryByText("foo")).toBe(null)
    expect(screen.queryByText("bar")).toBe(null)

    act(() => history.push("/base"))

    expect(await screen.findByText("bar")).toBeInTheDocument()
    expect(screen.queryByText("foo")).toBe(null)

    act(() => history.push("/base/foo"))

    expect(await screen.findByText("bar")).toBeInTheDocument()
    expect(await screen.findByText("foo")).toBeInTheDocument()
  })

  it("tells if router is loading", async () => {
    const Test = () => {
      const router = useContext(RouterContext)!

      return (
        <>
          {router.isLoading() ? "loading" : "loaded"}
          <Route>foo</Route>
        </>
      )
    }

    render(
      <Router>
        <Test />
      </Router>
    )

    expect(await screen.findByText("loading")).toBeInTheDocument()
    expect(screen.queryByText("loaded")).toBe(null)

    expect(await screen.findByText("loaded")).toBeInTheDocument()
    expect(screen.queryByText("loading")).toBe(null)
  })

  it("tells if router is unloading", async () => {
    const history = createStaticHistory("/foo")

    const Test = () => {
      const router = useContext(RouterContext)!

      return (
        <>
          {router.isUnloading() ? "unloading" : "unloaded"}
          <Route path="/foo">foo</Route>
          <Route path="/bar">bar</Route>
        </>
      )
    }

    render(
      <Router history={history}>
        <Test />
      </Router>
    )

    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(screen.queryByText("unloading")).toBe(null)

    act(() => history.push("/bar"))

    expect(await screen.findByText("unloading")).toBeInTheDocument()
    expect(await screen.findByText("bar")).toBeInTheDocument()
    expect(await screen.findByText("unloaded")).toBeInTheDocument()
  })

  it("tells if router is showing", async () => {
    const Test = () => {
      const router = useContext(RouterContext)!

      return (
        <>
          {router.isShowing() && "showing"}
          <Route>foo</Route>
        </>
      )
    }

    render(
      <Router>
        <Test />
      </Router>
    )

    expect(screen.queryByText("showing")).toBe(null)
    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(await screen.findByText("showing")).toBeInTheDocument()
  })

  it("redirects to another route", async () => {
    const history = createStaticHistory("/foo")

    const Test = () => {
      const router = useContext(RouterContext)!

      const handleClick = () => router.redirect("/bar")

      return (
        <>
          <Route path="/foo">
            foo
            <button onClick={handleClick}>redirect</button>
          </Route>
          <Route path="/bar">bar</Route>
        </>
      )
    }

    render(
      <Router history={history}>
        <Test />
      </Router>
    )

    expect(await screen.findByText("foo")).toBeInTheDocument()
    expect(screen.queryByText("bar")).toBe(null)

    fireEvent.click(screen.getByText("redirect"))

    await waitForElementToBeRemoved(() => screen.queryByText("foo"))

    expect(await screen.findByText("bar")).toBeInTheDocument()
  })
})
