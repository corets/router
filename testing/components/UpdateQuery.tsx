import React from "react"
import { useQuery } from "../../src/location/useQuery"

export const UpdateQuery = () => {
  const query = useQuery({
    foo: "1",
    bar: "2",
  })

  const handleSet = () => {
    query.set({
      foo: query.get().foo + 1,
    })
  }

  const handlePut = () => {
    query.put({
      foo: query.get().foo + 1,
    })
  }

  return (
    <div>
      {JSON.stringify(query.get())}
      <br />
      <button onClick={handleSet}>set</button>
      <button onClick={handlePut}>put</button>
    </div>
  )
}
