import { UsePathWithBase } from "./types"
import { useContext, useMemo } from "react"
import { RouterContext } from "./RouterContext"
import { createPathWithBase } from "../matcher"

export const usePathWithBase: UsePathWithBase = (path, base) => {
  const router = useContext(RouterContext)
  const basePath = base ?? router?.base
  const pathname = useMemo(() => createPathWithBase(path, basePath), [
    path,
    basePath,
  ])

  return pathname
}
