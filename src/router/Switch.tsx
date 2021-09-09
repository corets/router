import React, { useMemo } from "react"
import { Group, GroupProps } from "./Group"

let routeGroupIdCounter = 0

export type SwitchProps = Omit<GroupProps, "groupId">

export const Switch = (props: SwitchProps) => {
  const groupId = useMemo(() => (routeGroupIdCounter++).toString(), [])

  return <Group {...props} groupId={groupId} />
}
