import React, { ReactNode, useContext } from "react"
import { RouteGroupContext } from "../route/RouteGroupContext"

export type GroupProps = {
  loadable?: boolean
  unloadable?: boolean
  controlled?: boolean
  disabled?: boolean
  enabled?: boolean
  debug?: boolean
  wait?: number
  groupId?: string | null
  children?: ReactNode
}

export const Group = (props: GroupProps) => {
  const { children } = props

  const group = useContext(RouteGroupContext)

  const groupId =
    props.groupId === null ? undefined : props.groupId ?? group?.groupId
  const disabled =
    group?.disabled || props.disabled === true || props.enabled === false
  const loadable = props.loadable ?? group?.loadable
  const unloadable = props.unloadable ?? group?.unloadable
  const controlled = props.controlled ?? group?.controlled
  const wait = props.wait ?? group?.wait
  const debug = props.debug ?? group?.debug

  return (
    <RouteGroupContext.Provider
      value={{
        groupId,
        loadable,
        unloadable,
        controlled,
        disabled,
        debug,
        wait,
      }}
    >
      {children}
    </RouteGroupContext.Provider>
  )
}
