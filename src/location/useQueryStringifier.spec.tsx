import React from "react"
import { render, screen } from "@testing-library/react"
import { useQueryStringifier } from "./useQueryStringifier"

describe("useQueryStringifier", () => {
  it("returns a query stringifier instance", async () => {
    const Test = () => {
      const stringifier = useQueryStringifier()

      return <>{stringifier({ foo: "bar" })}</>
    }

    render(<Test />)

    expect(await screen.findByText(`foo=bar`)).toBeInTheDocument()
  })
})
