import React, { ReactNode, useMemo } from "react"
import { RouteGroupContext } from "../route/RouteGroupContext"

let routeGroupIdCounter = 0

export type SwitchProps = {
  children?: ReactNode
}

export const Switch = (props: SwitchProps) => {
  const { children } = props

  const groupId = useMemo(() => (routeGroupIdCounter++).toString(), [])

  return (
    <RouteGroupContext.Provider value={groupId}>
      {children}
    </RouteGroupContext.Provider>
  )
}
