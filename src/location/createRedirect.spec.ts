import { createRedirect } from "./createRedirect"
import { createTestHistory } from "../router"

describe("createRedirect", () => {
  it("redirects", () => {
    const history = createTestHistory("/")
    const redirect = createRedirect(history)

    redirect("/foo")

    expect(history.location.pathname).toBe("/foo")
  })

  it("redirects with base path", () => {
    const history = createTestHistory("/")
    const redirect = createRedirect(history, { base: "/bar" })

    redirect("/foo")

    expect(history.location.pathname).toBe("/bar/foo")

    redirect("/foo", { base: "/baz" })

    expect(history.location.pathname).toBe("/baz/foo")
  })

  it("redirects with query", () => {
    const history = createTestHistory("/")
    const redirect = createRedirect(history)

    redirect("/foo")

    expect(history.location.pathname).toBe("/foo")
    expect(history.location.search).toBe("")

    redirect("/bar", { query: { foo: "bar" } })

    expect(history.location.pathname).toBe("/bar")
    expect(history.location.search).toBe("?foo=bar")
  })

  it("redirects and preserves query", () => {
    const history = createTestHistory("/")
    const redirect = createRedirect(history)

    redirect("/foo", { query: { foo: "bar" } })

    expect(history.location.pathname).toBe("/foo")
    expect(history.location.search).toBe("?foo=bar")

    redirect("/bar", { preserveQuery: true })

    expect(history.location.pathname).toBe("/bar")
    expect(history.location.search).toBe("?foo=bar")

    redirect("/foo")

    expect(history.location.pathname).toBe("/foo")
    expect(history.location.search).toBe("")
  })
})
