import React, { useState } from "react"

export const Counter = () => {
  const [count, setCount] = useState(0)
  return (
    <div>
      counter: <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  )
}
