import { useContext, useEffect, useMemo } from "react"
import { RouterContext } from "./index"
import { History } from "history"
import { useRedirect } from "../location"
import { createPathWithBase } from "../matcher"

export type RedirectProps = {
  to: string
  base?: string
  history?: History
}

export const Redirect = (props: RedirectProps) => {
  const { to, history } = props

  const router = useContext(RouterContext)
  const redirect = useRedirect(history)
  const base = props.base ?? router?.base
  const href = useMemo(() => createPathWithBase(to, base), [to, base])

  useEffect(() => {
    redirect(href)
  }, [])

  return null
}
