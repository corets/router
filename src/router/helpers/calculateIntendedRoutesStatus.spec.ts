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
      IntendedRouteStatus.Show
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Show, true)).toBe(
      IntendedRouteStatus.Showing
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Unload, true)).toBe(
      IntendedRouteStatus.Initialize
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Unloaded, true)).toBe(
      IntendedRouteStatus.Initialize
    )

    expect(calculateIntendedRoutesStatus(RouteStatus.Idle, false)).toBe(
      IntendedRouteStatus.Idling
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
    expect(calculateIntendedRoutesStatus(RouteStatus.Show, false)).toBe(
      IntendedRouteStatus.Unload
    )
    expect(calculateIntendedRoutesStatus(RouteStatus.Shown, false)).toBe(
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
