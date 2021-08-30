import React, { ReactNode, useMemo } from "react"
import { Group } from "./Group"

let routeGroupIdCounter = 0

export type SwitchProps = {
  children?: ReactNode
}

export const Switch = (props: SwitchProps) => {
  const { children } = props
  const groupId = useMemo(() => (routeGroupIdCounter++).toString(), [])

  return <Group groupId={groupId}>{children}</Group>
}
