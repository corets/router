import { useContext } from "react"
import { RouterContext } from "./RouterContext"
import { UseRouter } from "./types"

export const useRouter: UseRouter = () => {
  const router = useContext(RouterContext)

  if (!router) {
    throw new Error(
      "RouterContext is empty, make sure to wrap your components inside <Router/> ... </Router>"
    )
  }

  return router
}
