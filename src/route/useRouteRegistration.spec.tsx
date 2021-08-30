import { createValue } from "@corets/value"
import { RouterRegistry } from "../router"
import { act, render } from "@testing-library/react"
import { RouterRegistryContext } from "../router/RouterRegistryContext"
import React from "react"
import { useRouteRegistration } from "./useRouteRegistration"
import { RouteRegistration, RouteState, RouteStatus } from "./types"
import { RouteContext } from "."

describe("useRouteRegistration", () => {
  it("registers route and updates status", () => {
    const registry = createValue<RouterRegistry>({})
    let registration: RouteRegistration

    const Test1 = () => {
      registration = useRouteRegistration({
        path: "/foo",
        exact: true,
        absolute: false,
        debug: false,
        disabled: false,
      })

      return (
        <RouteContext.Provider value={registration.route as any}>
          <Test2 />
        </RouteContext.Provider>
      )
    }

    const Test2 = () => {
      useRouteRegistration({
        path: "/bar",
        exact: true,
        absolute: false,
        debug: false,
        disabled: false,
      })

      return null
    }

    const result = render(
      <RouterRegistryContext.Provider value={registry}>
        <Test1 />
      </RouterRegistryContext.Provider>
    )

    expect(registration!).toBeDefined()
    expect(Object.values(registry.get()).length).toBe(2)
    expect(Object.values(registry.get())[0]).toEqual({
      path: "/foo",
      exact: true,
      groupId: undefined,
      routeId: "0",
      status: RouteStatus.Idle,
      disabled: false,
    } as RouteState)
    expect(Object.values(registry.get())[1]).toEqual({
      path: "/foo/bar",
      exact: true,
      groupId: undefined,
      routeId: "1",
      status: RouteStatus.Idle,
      disabled: false,
    } as RouteState)
    expect(registration!.route).toEqual({
      path: "/foo",
      exact: true,
      groupId: undefined,
      routeId: "0",
      status: RouteStatus.Idle,
      disabled: false,
    } as RouteState)

    act(() => registration.reportStatus(RouteStatus.Visible))

    expect(Object.values(registry.get())[0]).toEqual({
      path: "/foo",
      exact: true,
      groupId: undefined,
      routeId: "0",
      status: RouteStatus.Visible,
      disabled: false,
    } as RouteState)

    act(() => result.unmount())

    expect(Object.values(registry.get()).length).toBe(0)
  })
})
