import React, { AnchorHTMLAttributes, forwardRef, MouseEvent } from "react"
import { History } from "history"
import { useMatch, useRedirect } from "../location"
import { usePathWithBase } from "./usePathWithBase"

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
  base?: string
  exact?: boolean
  history?: History
  intercept?: boolean
}

export const Link = forwardRef((props: LinkProps, ref) => {
  const { to, exact, history, base, intercept = true, ...otherProps } = props

  const href = usePathWithBase(to, base)
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

    redirect(to, { base })
  }

  return (
    <a
      {...otherProps}
      ref={ref as any}
      data-active={matches}
      href={href}
      onClick={(e) => handleClick(e)}
    />
  )
})
