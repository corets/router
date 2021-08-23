import { RouteStatus } from "../../route"

export enum IntendedRouteStatus {
  Idle = "IDLE",
  Visible = "VISIBLE",
  Initialize = "INITIALIZE",
  Initializing = "INITIALIZING",
  Load = "LOAD",
  Loading = "LOADING",
  Unload = "UNLOAD",
  Unloading = "UNLOADING",
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
      return IntendedRouteStatus.Visible
    } else if (currentStatus === RouteStatus.Visible) {
      return IntendedRouteStatus.Visible
    } else if (currentStatus === RouteStatus.Unload) {
      return IntendedRouteStatus.Unload
    } else if (currentStatus === RouteStatus.Unloaded) {
      return IntendedRouteStatus.Initialize
    }

    return IntendedRouteStatus.Initialize
  }

  if (
    [
      RouteStatus.Initialize,
      RouteStatus.Initialized,
      RouteStatus.Load,
      RouteStatus.Loaded,
    ].includes(currentStatus)
  ) {
    return IntendedRouteStatus.Idle
  } else if (currentStatus === RouteStatus.Visible) {
    return IntendedRouteStatus.Unload
  } else if (currentStatus === RouteStatus.Unload) {
    return IntendedRouteStatus.Unloading
  } else if (currentStatus === RouteStatus.Unloaded) {
    return IntendedRouteStatus.Idle
  }

  return IntendedRouteStatus.Idle
}
