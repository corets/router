import React from "react"
import { useRouter } from "../../src/router/useRouter"

export const ProgressIndicator = () => {
  const router = useRouter()

  const status = (() => {
    if (router.isLoading()) {
      if (! router.isShowing() && ! router.isUnloading()) {

      return "initializing"
      }

      return "loading"
    }

    return "-"
  })()

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
      {status}
    </div>
  )
}
