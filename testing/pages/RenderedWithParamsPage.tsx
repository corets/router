import React from "react"
import { Counter } from "../components/Counter"
import { UpdateParams } from "../components/UpdateParams"

export const RenderedWithParamsPage = (props) => {
  return (
    <div>
      rendered page {JSON.stringify(props)} (passed directly)
      <br />
      <Counter />
      <br />
      <UpdateParams />
    </div>
  )
}
