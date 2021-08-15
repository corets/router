import { createTestHistory } from "./createTestHistory"

describe("createTestHistory", () => {
  it("creates an history for testing purposes", () => {
    const testHistory = createTestHistory("/foo", { bar: "baz" })

    expect(testHistory).toBeDefined()
    expect(testHistory.location.pathname).toBe("/foo")
    expect(testHistory.location.search).toBe("?bar=baz")
  })
})
