import { createValue } from "@corets/value"
import { RouterRegistry } from "../router"
import { act, render } from "@testing-library/react"
import { RouterRegistryContext } from "../router/RouterRegistryContext"
import React from "react"
import { useRouteRegistration } from "./useRouteRegistration"
import { RouteRegistration, RouteState, RouteStatus } from "./types"

describe("useRouteRegistration", () => {
  it("registers route and updates status", () => {
    const registry = createValue<RouterRegistry>({})
    let registration: RouteRegistration

    const Test = () => {
      registration = useRouteRegistration({
        path: "/foo",
        exact: true,
        debug: false,
      })

      return null
    }

    const result = render(
      <RouterRegistryContext.Provider value={registry}>
        <Test />
      </RouterRegistryContext.Provider>
    )

    expect(registration!).toBeDefined()
    expect(Object.values(registry.get()).length).toBe(1)
    expect(Object.values(registry.get())[0]).toEqual({
      path: "/foo",
      exact: true,
      groupId: undefined,
      routeId: "0",
      status: RouteStatus.Idle,
    } as RouteState)
    expect(registration!.route).toEqual({
      path: "/foo",
      exact: true,
      groupId: undefined,
      routeId: "0",
      status: RouteStatus.Idle,
    } as RouteState)

    act(() => registration.reportStatus(RouteStatus.Show))

    expect(Object.values(registry.get())[0]).toEqual({
      path: "/foo",
      exact: true,
      groupId: undefined,
      routeId: "0",
      status: RouteStatus.Show,
    } as RouteState)

    act(() => result.unmount())

    expect(Object.values(registry.get()).length).toBe(0)
  })
})
