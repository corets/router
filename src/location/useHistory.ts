import { useContext, useEffect, useMemo, useState } from "react"
import { createBrowserHistory } from "history"
import { RouterContext } from "../router"
import { UseHistory } from "./types"

export const useHistory: UseHistory = (history) => {
  const [tick, setTick] = useState(0)
  const router = useContext(RouterContext)

  const hookedHistory = useMemo(
    () => history ?? router?.history ?? createBrowserHistory(),
    []
  )

  useEffect(() => {
    return hookedHistory.listen(() => setTick((tick) => tick + 1))
  }, [])

  return hookedHistory
}
