import { RouteStatus } from "../../route"

export enum IntendedRouteStatus {
  Initialize,
  Initializing,
  Load,
  Loading,
  Show,
  Showing,
  Unload,
  Unloading,
  Disable,
  Idle,
}

export const calculateIntendedRoutesStatus = (
  currentStatus: RouteStatus,
  matches: boolean
): IntendedRouteStatus => {
  if (matches) {
    if (currentStatus === RouteStatus.Idle) {
      return IntendedRouteStatus.Initialize
    } else if (currentStatus === RouteStatus.Initialize) {
      return IntendedRouteStatus.Initializing
    } else if (currentStatus === RouteStatus.Initialized) {
      return IntendedRouteStatus.Load
    } else if (currentStatus === RouteStatus.Load) {
      return IntendedRouteStatus.Loading
    } else if (currentStatus === RouteStatus.Loaded) {
      return IntendedRouteStatus.Show
    } else if (currentStatus === RouteStatus.Show) {
      return IntendedRouteStatus.Showing
    }
  } else {
    if (
      [
        RouteStatus.Initialize,
        RouteStatus.Initialized,
        RouteStatus.Loaded,
        RouteStatus.Show,
        RouteStatus.Shown,
      ].includes(currentStatus)
    ) {
      return IntendedRouteStatus.Unload
    } else if (currentStatus === RouteStatus.Load) {
      return IntendedRouteStatus.Disable
    } else if (currentStatus === RouteStatus.Unload) {
      return IntendedRouteStatus.Unloading
    } else if (currentStatus === RouteStatus.Unloaded) {
      return IntendedRouteStatus.Disable
    }
  }

  return IntendedRouteStatus.Idle
}
