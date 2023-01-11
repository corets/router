import React, { useEffect, useState, useRef } from "react"
import { createTestHistory } from "../router/createTestHistory"
import { useQuery } from "./useQuery"
import { fireEvent, render, screen } from "@testing-library/react"
import { Router } from "../router"
import { createQueryStringifier } from "./createQueryStringifier"

describe("useQuery", () => {
  it("returns relevant query parts", async () => {
    const testHistory = createTestHistory("/", {
      foo: "bar",
      baz: "yolo",
    })

    const Test = () => {
      const query = useQuery({ foo: "foo", bar: "bar" })

      return <>{JSON.stringify(query.get())}</>
    }

    render(
      <Router history={testHistory}>
        <Test />
      </Router>
    )

    expect(
      await screen.findByText(`{"foo":"bar","bar":"bar"}`)
    ).toBeInTheDocument()
  })

  it("replaces relevant query parts", async () => {
    const testHistory = createTestHistory("/", {
      foo: "bar",
      baz: "yolo",
    })
    const stringifier = createQueryStringifier()

    const Test = () => {
      const query = useQuery({ foo: "foo", bar: "bar" })

      return (
        <>
          {JSON.stringify(query.get())}
          <button onClick={() => query.put({ bar: "baz" })}>button</button>
        </>
      )
    }

    render(
      <Router history={testHistory}>
        <Test />
      </Router>
    )

    expect(
      await screen.findByText(`{"foo":"bar","bar":"bar"}`)
    ).toBeInTheDocument()

    fireEvent.click(screen.getByText("button"))

    expect(
      await screen.findByText(`{"foo":"bar","bar":"baz"}`)
    ).toBeInTheDocument()
    expect(testHistory.location.search).toBe(
      `?${stringifier({
        foo: "bar",
        bar: "baz",
        baz: "yolo",
      })}`
    )
  })

  it("resets relevant query parts", async () => {
    const testHistory = createTestHistory("/", {
      foo: "bar",
      baz: "yolo",
    })
    const stringifier = createQueryStringifier()

    const Test = () => {
      const query = useQuery({ foo: "foo", bar: "bar" })

      return (
        <>
          {JSON.stringify(query.get())}
          <button onClick={() => query.set({ bar: "baz" })}>button</button>
        </>
      )
    }

    render(
      <Router history={testHistory}>
        <Test />
      </Router>
    )

    expect(
      await screen.findByText(`{"foo":"bar","bar":"bar"}`)
    ).toBeInTheDocument()

    fireEvent.click(screen.getByText("button"))

    expect(
      await screen.findByText(`{"foo":"foo","bar":"baz"}`)
    ).toBeInTheDocument()
    expect(testHistory.location.search).toBe(
      `?${stringifier({
        bar: "baz",
        baz: "yolo",
      })}`
    )
  })

  it("synchs changes synchronously", async () => {
    const testHistory = createTestHistory("/", {
      foo: "bar",
      baz: "yolo",
    })

    const Test = () => {
      const query = useQuery({ foo: "foo" })
      const resultRef = useRef<any>()

      useEffect(() => {
        new Promise<void>((resolve) => {
          query.put({ foo: "bar" })
          resultRef.current = query.get()

          resolve()
        })
      }, [])

      return <>{JSON.stringify(resultRef.current)}</>
    }

    render(
      <Router history={testHistory}>
        <Test />
      </Router>
    )

    expect(await screen.findByText(`{"foo":"bar"}`)).toBeInTheDocument()
  })
})
