import React from "react"
import { Counter } from "../components/Counter"
import { UpdateParams } from "../components/UpdateParams"
import { useParams } from "../../src"

export const LoadedPage = () => {
  const params = useParams()

  return (
    <div>
      loaded page {JSON.stringify(params)} (from context)
      <br />
      <Counter />
      <br />
      <UpdateParams />
    </div>
  )
}
