import { createQueryStringifier } from "./createQueryStringifier"

describe("createQueryStringifier", () => {
  it("creates a query stringifier", () => {
    const stringifier = createQueryStringifier()

    expect(stringifier({ foo: "bar" })).toBe("foo=bar")
  })
})
