import React from "react"
import { useRouter } from "../../src/router/useRouter"

export const ProgressIndicator = () => {
  const router = useRouter()

  return (
    <div
      style={{
        background: "red",
        color: "white",
        padding: "10px",
        position: "absolute",
        top: 0,
        right: 0,
      }}
    >
      {router.isLoading() ? "loading" : "-"}
    </div>
  )
}
