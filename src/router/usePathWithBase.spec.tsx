import { usePathWithBase } from "./usePathWithBase"
import React from "react"
import { render, screen } from "@testing-library/react"
import { Router } from "./Router"

describe("usePathWithBase", () => {
  it("returns a path with base", async () => {
    const Test = () => {
      const path1 = usePathWithBase("/bar")
      const path2 = usePathWithBase("/bar", "/")

      return (
        <div>
          <a href={path1}>link1</a>
          <a href={path2}>link2</a>
        </div>
      )
    }

    render(
      <Router base="/foo">
        <Test />
      </Router>
    )

    expect(await screen.findByText("link1")).toHaveAttribute("href", "/foo/bar")
    expect(await screen.findByText("link2")).toHaveAttribute("href", "/bar")
  })
})
