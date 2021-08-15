import { createQueryParser } from "./createQueryParser"

describe("createQueryParser", () => {
  it("creates a query parser", () => {
    const parser = createQueryParser()

    expect(parser("foo=bar")).toEqual({ foo: "bar" })
  })
})
