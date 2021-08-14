import React, {
  AnchorHTMLAttributes,
  forwardRef,
  MouseEvent,
  useContext,
  useMemo,
} from "react"
import { History } from "history"
import { RouterContext } from "./index"
import { createPathWithBase } from "../matcher"
import { useMatch, useRedirect } from "../location"

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
  base?: string
  exact?: boolean
  history?: History
  intercept?: boolean
}

export const Link = forwardRef((props: LinkProps, ref) => {
  const { to, exact, history, intercept = true, ...otherProps } = props

  const router = useContext(RouterContext)
  const base = props.base ?? router?.base
  const href = useMemo(() => createPathWithBase(to, base), [base, to])
  const [matches] = useMatch(to, { base, exact })
  const redirect = useRedirect(history)

  const handleClick = (e: MouseEvent) => {
    const interceptClick =
      intercept &&
      [undefined, "_self"].includes(otherProps.target) &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey

    if (!interceptClick) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    redirect(href)
  }

  return (
    <a
      {...otherProps}
      ref={ref as any}
      data-matches={matches}
      href={href}
      onClick={(e) => handleClick(e)}
    />
  )
})
