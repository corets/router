import {
  calculateIntendedRoutesStatus,
  IntendedRouteStatus,
} from "./calculateIntendedRoutesStatus"
import { RouteStatus } from "../../route"

describe("calculateIntendedRoutesStatus", () => {
  it("calculates indented route status", () => {
    expect(calculateIntendedRoutesStatus(RouteStatus.Idle, true)).toBe(
      IntendedRouteStatus.Initialize
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Initialize, true)).toBe(
      IntendedRouteStatus.Initializing
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Initialized, true)).toBe(
      IntendedRouteStatus.Load
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Load, true)).toBe(
      IntendedRouteStatus.Loading
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Loaded, true)).toBe(
      IntendedRouteStatus.Visible
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Unload, true)).toBe(
      IntendedRouteStatus.Initialize
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Unloaded, true)).toBe(
      IntendedRouteStatus.Initialize
    )

    expect(calculateIntendedRoutesStatus(RouteStatus.Idle, false)).toBe(
      IntendedRouteStatus.Idle
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Initialize, false)).toBe(
      IntendedRouteStatus.Unload
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Initialized, false)).toBe(
      IntendedRouteStatus.Unload
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Load, false)).toBe(
      IntendedRouteStatus.Unload
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Loaded, false)).toBe(
      IntendedRouteStatus.Unload
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Visible, false)).toBe(
      IntendedRouteStatus.Unload
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Unload, false)).toBe(
      IntendedRouteStatus.Unloading
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Unloaded, false)).toBe(
      IntendedRouteStatus.Idle
    )
  })
})
