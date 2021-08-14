import { RouteStatus } from "../route/types"

export const logRouterLocationChanged = (path: string) => {
  console.log("[Router]: location changed to", path)
}

export const logRouterScheduledRouteToStatus = (
  path: string,
  scheduledStatus: RouteStatus
) => {
  console.log(`[Router]: route ${path} is scheduled to ${scheduledStatus}`)
}

export const logRouteIsTryingToChangeStatus = (
  path: string,
  intendedStatus: RouteStatus
) => {
  console.log(`[Router]: route ${path} is trying to ${intendedStatus}`)
}

export const logRouteHasChangedStatus = (
  path: string,
  newStatus: RouteStatus
) => {
  console.log(`[Router]: route ${path} is ${newStatus}`)
}

export const logRouteIsWaitingForLoadersToRegister = (
  path: string,
  wait: number
) => {
  console.log(
    `[Router]: route ${path} is waiting ${wait}ms for loaders to register`
  )
}

export const logRouteIsWaitingForUnloadersToRegister = (
  path: string,
  wait: number
) => {
  console.log(
    `[Router]: route ${path} is waiting ${wait}ms for unloaders to register`
  )
}

export const logRouteDetectedNewLoader = (
  path: string,
  numberOfLoaders: number
) => {
  console.log(
    `[Router]: route ${path} detected a new loader (total ${numberOfLoaders})`
  )
}

export const logRouteDetectedNewUnloader = (
  path: string,
  numberOfUnloaders: number
) => {
  console.log(
    `[Router]: route ${path} detected a new unloader (total ${numberOfUnloaders})`
  )
}

export const logRouteIsWaitingForLoaders = (
  path: string,
  numberOfActiveLoaders: number
) => {
  console.log(
    `[Router]: route ${path} is waiting for loaders to finish (total ${numberOfActiveLoaders})`
  )
}

export const logRouteIsWaitingForUnloaders = (
  path: string,
  numberOfActiveLoaders: number
) => {
  console.log(
    `[Router]: route ${path} is waiting for unloaders to finish (total ${numberOfActiveLoaders})`
  )
}

export const logRouteResolvedAllLoaders = (
  path: string,
  numberOfLoaders: number
) => {
  console.log(
    `[Router]: route ${path} resolved all loaders (total ${numberOfLoaders})`
  )
}

export const logRouteResolvedAllUnloaders = (
  path: string,
  numberOfUnloaders: number
) => {
  console.log(
    `[Router]: route ${path} resolved all unloaders (total ${numberOfUnloaders})`
  )
}

export const logRouteRegistered = (path: string) => {
  console.log(`[Router]: route ${path} registered`)
}

export const logRouteUnregistered = (path: string) => {
  console.log(`[Router]: route ${path} unregistered`)
}

export const logRouteInitializedWithComponent = (path: string) => {
  console.log(`[Router]: route ${path} initialized with a component`)
}

export const logRouteInitializedWithElement = (path: string) => {
  console.log(`[Router]: route ${path} initialized with a react element`)
}

export const logRouteIsLoadingInitializer = (path: string) => {
  console.log(`[Router]: route ${path} is about to load its initializer`)
}

export const logRouteHasLoadedInitializer = (path: string) => {
  console.log(`[Router]: route ${path} has loaded its initializer`)
}
