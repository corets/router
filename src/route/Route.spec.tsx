import { act, render, screen } from "@testing-library/react"
import { createTestHistory, Router } from "../router"
import React from "react"
import { Route } from "./Route"

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
})
