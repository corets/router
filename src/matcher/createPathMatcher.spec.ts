import { createPathMatcher } from "./createPathMatcher"

describe("createPathMatcher", () => {
  it("does not throw with unexpected parameters", () => {
    const matcher = createPathMatcher()

    expect(matcher(null as any, "/")).toEqual([false, null])
    expect(matcher(null as any, "/")).toEqual([false, null])
    expect(matcher(null as any, null as any)).toEqual([false, null])
    expect(matcher(null as any, null as any)).toEqual([false, null])
    expect(matcher("/", null as any)).toEqual([false, null])
    expect(matcher("/", null as any)).toEqual([false, null])
  })

  it("matches regular paths", () => {
    const matcher = createPathMatcher()

    expect(matcher("/", "/")).toEqual([true, {}])
    expect(matcher("/", "/foo")).toEqual([true, {}])
    expect(matcher("/foo", "/foo")).toEqual([true, {}])
    expect(matcher("/foo", "/")).toEqual([false, null])
    expect(matcher("/foo", "/bar")).toEqual([false, null])
  })

  it("is not case sensitive", () => {
    const matcher = createPathMatcher()

    expect(matcher("/foo", "/FOO")).toEqual([true, {}])
    expect(matcher("/FOO", "/foo")).toEqual([true, {}])
    expect(matcher("/Foo", "/foo")).toEqual([true, {}])
    expect(matcher("/foo", "/Foo")).toEqual([true, {}])
  })

  it("ignores trailing slashes", () => {
    const matcher = createPathMatcher()

    expect(matcher("/foo/bar/", "/foo/bar")).toEqual([true, {}])
    expect(matcher("/foo/bar/", "/foo/bar", { exact: true })).toEqual([
      true,
      {},
    ])
    expect(matcher("/foo/bar", "/foo/bar/")).toEqual([true, {}])
    expect(matcher("/foo/bar", "/foo/bar/", { exact: true })).toEqual([
      true,
      {},
    ])
    expect(matcher("/foo/bar/", "/foo/bar/")).toEqual([true, {}])
    expect(matcher("/foo/bar/", "/foo/bar/", { exact: true })).toEqual([
      true,
      {},
    ])
  })

  it("matches exact paths", () => {
    const matcher = createPathMatcher()

    expect(matcher("/", "/", { exact: true })).toEqual([true, {}])
    expect(matcher("/", "/foo", { exact: true })).toEqual([false, null])
    expect(matcher("/foo", "/foo", { exact: true })).toEqual([true, {}])
    expect(matcher("/foo", "/", { exact: true })).toEqual([false, null])
    expect(matcher("/foo", "/bar", { exact: true })).toEqual([false, null])
  })

  it("matches regular paths with a base path", () => {
    const matcher = createPathMatcher()

    expect(matcher("/", "/", { base: "/baz" })).toEqual([false, null])
    expect(matcher("/", "/baz", { base: "/baz" })).toEqual([true, {}])
    expect(matcher("/", "/foo", { base: "/baz" })).toEqual([false, null])
    expect(matcher("/", "/baz/foo", { base: "/baz" })).toEqual([true, {}])
    expect(matcher("/foo", "/foo", { base: "/baz" })).toEqual([false, null])
    expect(matcher("/foo", "/baz/foo", { base: "/baz" })).toEqual([true, {}])
    expect(matcher("/foo", "/", { base: "/baz" })).toEqual([false, null])
    expect(matcher("/foo", "/baz", { base: "/baz" })).toEqual([false, null])
    expect(matcher("/foo", "/bar", { base: "/baz" })).toEqual([false, null])
    expect(matcher("/foo", "/baz/bar", { base: "/baz" })).toEqual([false, null])
  })

  it("matches exact paths with a base path", () => {
    const matcher = createPathMatcher()

    expect(matcher("/", "/", { exact: true, base: "/baz" })).toEqual([
      false,
      null,
    ])
    expect(matcher("/", "/baz", { exact: true, base: "/baz" })).toEqual([
      true,
      {},
    ])
    expect(matcher("/", "/foo", { exact: true, base: "/baz" })).toEqual([
      false,
      null,
    ])
    expect(matcher("/", "/baz/foo", { exact: true, base: "/baz" })).toEqual([
      false,
      null,
    ])
    expect(matcher("/foo", "/foo", { exact: true, base: "/baz" })).toEqual([
      false,
      null,
    ])
    expect(matcher("/foo", "/baz/foo", { exact: true, base: "/baz" })).toEqual([
      true,
      {},
    ])
    expect(matcher("/foo", "/", { exact: true, base: "/baz" })).toEqual([
      false,
      null,
    ])
    expect(matcher("/foo", "/baz", { exact: true, base: "/baz" })).toEqual([
      false,
      null,
    ])
    expect(matcher("/foo", "/bar", { exact: true, base: "/baz" })).toEqual([
      false,
      null,
    ])
    expect(matcher("/foo", "/baz/bar", { exact: true, base: "/baz" })).toEqual([
      false,
      null,
    ])
  })

  it("matches path parameters", () => {
    const matcher = createPathMatcher()

    expect(matcher("/foo/:bar", "/foo")).toEqual([false, null])
    expect(matcher("/foo/:bar", "/foo", { exact: true })).toEqual([false, null])
    expect(matcher("/foo/:bar", "/foo/1")).toEqual([true, { bar: "1" }])
    expect(matcher("/foo/:bar", "/foo/1", { exact: true })).toEqual([
      true,
      { bar: "1" },
    ])
    expect(matcher("/foo/:bar", "/foo/1/2")).toEqual([true, { bar: "1" }])
    expect(matcher("/foo/:bar", "/foo/1/2", { exact: true })).toEqual([
      false,
      null,
    ])
    expect(matcher("/foo/:bar/:baz", "/foo/1/2")).toEqual([
      true,
      { bar: "1", baz: "2" },
    ])
    expect(matcher("/foo/:bar/:baz", "/foo/1/2", { exact: true })).toEqual([
      true,
      { bar: "1", baz: "2" },
    ])
    expect(matcher("/foo/:bar", "/baz/1")).toEqual([false, null])
  })

  it("matches path parameters with ?", () => {
    const matcher = createPathMatcher()

    expect(matcher("/foo/:bar?", "/foo")).toEqual([true, { bar: null }])
    expect(matcher("/foo/:bar?", "/foo", { exact: true })).toEqual([
      true,
      { bar: null },
    ])
    expect(matcher("/foo/:bar?", "/foo/1", { exact: true })).toEqual([
      true,
      { bar: "1" },
    ])
    expect(matcher("/foo/:bar?", "/foo/1/2")).toEqual([true, { bar: "1" }])
    expect(matcher("/foo/:bar?", "/foo/1/2", { exact: true })).toEqual([
      false,
      null,
    ])
    expect(matcher("/foo/:bar", "/foo/1/2/3")).toEqual([true, { bar: "1" }])
    expect(matcher("/foo/:bar?", "/foo/1/2/3", { exact: true })).toEqual([
      false,
      null,
    ])
    expect(matcher("/foo/:bar?/baz", "/foo/1/baz")).toEqual([
      true,
      { bar: "1" },
    ])
    expect(matcher("/foo/:bar?/baz", "/foo/1/baz", { exact: true })).toEqual([
      true,
      { bar: "1" },
    ])
    expect(matcher("/foo/:bar?/baz", "/foo/baz")).toEqual([true, { bar: null }])
    expect(matcher("/foo/:bar?/baz", "/foo/baz", { exact: true })).toEqual([
      true,
      { bar: null },
    ])
    expect(matcher("/foo/:bar?/baz", "/foo/1/2/baz")).toEqual([false, null])
    expect(matcher("/foo/:bar?/baz", "/foo/1/2/baz", { exact: true })).toEqual([
      false,
      null,
    ])
  })

  it("matches path parameters with +", () => {
    const matcher = createPathMatcher()

    expect(matcher("/foo/:bar+", "/foo")).toEqual([false, null])
    expect(matcher("/foo/:bar+", "/foo", { exact: true })).toEqual([
      false,
      null,
    ])
    expect(matcher("/foo/:bar+", "/foo/1")).toEqual([true, { bar: "1" }])
    expect(matcher("/foo/:bar+", "/foo/1", { exact: true })).toEqual([
      true,
      { bar: "1" },
    ])
    expect(matcher("/foo/:bar+", "/foo/1/2")).toEqual([true, { bar: "1/2" }])
    expect(matcher("/foo/:bar+", "/foo/1/2", { exact: true })).toEqual([
      true,
      { bar: "1/2" },
    ])
    expect(matcher("/foo/:bar+", "/foo/1/2/3")).toEqual([
      true,
      { bar: "1/2/3" },
    ])
    expect(matcher("/foo/:bar+", "/foo/1/2/3", { exact: true })).toEqual([
      true,
      { bar: "1/2/3" },
    ])
    expect(matcher("/foo/:bar+/baz", "/foo/baz")).toEqual([false, null])
    expect(matcher("/foo/:bar+/baz", "/foo/baz", { exact: true })).toEqual([
      false,
      null,
    ])
    expect(matcher("/foo/:bar+/baz", "/foo/1/baz")).toEqual([
      true,
      { bar: "1" },
    ])
    expect(matcher("/foo/:bar+/baz", "/foo/1/baz", { exact: true })).toEqual([
      true,
      { bar: "1" },
    ])
    expect(matcher("/foo/:bar+/baz", "/foo/1/2/baz")).toEqual([
      true,
      { bar: "1/2" },
    ])
    expect(matcher("/foo/:bar+/baz", "/foo/1/2/baz", { exact: true })).toEqual([
      true,
      { bar: "1/2" },
    ])
    expect(matcher("/foo/:bar+/baz", "/foo/1/2/3/baz")).toEqual([
      true,
      { bar: "1/2/3" },
    ])
    expect(
      matcher("/foo/:bar+/baz", "/foo/1/2/3/baz", { exact: true })
    ).toEqual([true, { bar: "1/2/3" }])
  })

  it("matches path parameters with *", () => {
    const matcher = createPathMatcher()

    expect(matcher("/:bar*", "/")).toEqual([true, { bar: null }])
    expect(matcher("/:bar*", "/", { exact: true })).toEqual([
      true,
      { bar: null },
    ])
    expect(matcher("/foo/:bar*", "/foo")).toEqual([true, { bar: null }])
    expect(matcher("/foo/:bar*", "/foo", { exact: true })).toEqual([
      true,
      { bar: null },
    ])
    expect(matcher("/foo/:bar*", "/foo/1")).toEqual([true, { bar: "1" }])
    expect(matcher("/foo/:bar*", "/foo/1", { exact: true })).toEqual([
      true,
      { bar: "1" },
    ])
    expect(matcher("/foo/:bar*", "/foo/1/2")).toEqual([true, { bar: "1/2" }])
    expect(matcher("/foo/:bar*", "/foo/1/2", { exact: true })).toEqual([
      true,
      { bar: "1/2" },
    ])
    expect(matcher("/foo/:bar*", "/foo/1/2/3")).toEqual([
      true,
      { bar: "1/2/3" },
    ])
    expect(matcher("/foo/:bar*", "/foo/1/2/3", { exact: true })).toEqual([
      true,
      { bar: "1/2/3" },
    ])
    expect(matcher("/foo/:bar*/baz", "/foo/1/baz")).toEqual([
      true,
      { bar: "1" },
    ])
    expect(matcher("/foo/:bar*/baz", "/foo/1/baz", { exact: true })).toEqual([
      true,
      { bar: "1" },
    ])
    expect(matcher("/foo/:bar*/baz", "/foo/1/2/baz")).toEqual([
      true,
      { bar: "1/2" },
    ])
    expect(matcher("/foo/:bar*/baz", "/foo/1/2/baz", { exact: true })).toEqual([
      true,
      { bar: "1/2" },
    ])
    expect(matcher("/foo/:bar*/baz", "/foo/1/2/3/baz")).toEqual([
      true,
      { bar: "1/2/3" },
    ])
    expect(
      matcher("/foo/:bar*/baz", "/foo/1/2/3/baz", { exact: true })
    ).toEqual([true, { bar: "1/2/3" }])
  })
})
