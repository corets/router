import { createPathWithBase } from "./createPathWithBase"

describe("createPathWithBase", () => {
  it("creates a path with base path", () => {
    expect(createPathWithBase("/", "/")).toBe("/")
    expect(createPathWithBase("/foo", "/")).toBe("/foo")
    expect(createPathWithBase("/", "/foo")).toBe("/foo")
    expect(createPathWithBase("/bar", "/foo")).toBe("/foo/bar")
  })
})

it("does not add base to external paths", () => {
  expect(createPathWithBase("http://foo", "/bar")).toBe("http://foo")
  expect(createPathWithBase("https://foo", "/bar")).toBe("https://foo")
  expect(createPathWithBase("//foo", "/bar")).toBe("//foo")
})
