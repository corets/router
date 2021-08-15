import React from "react"
import { useQueryParser } from "./useQueryParser"
import { render, screen } from "@testing-library/react"

describe("useQueryParser", () => {
  it("returns a query parser instance", async () => {
    const Test = () => {
      const parser = useQueryParser()

      return <>{JSON.stringify(parser("foo=bar"))}</>
    }

    render(<Test />)

    expect(await screen.findByText(`{"foo":"bar"}`)).toBeInTheDocument()
  })
})
