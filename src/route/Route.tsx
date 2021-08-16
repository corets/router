import React, {
  ComponentType,
  isValidElement,
  ReactNode,
  useEffect,
  useState,
} from "react"
import { useAsync } from "@corets/use-async"
import {
  logRouteHasChangedStatus,
  logRouteHasLoadedInitializer,
  logRouteInitializedWithComponent,
  logRouteInitializedWithElement,
  logRouteIsLoadingInitializer,
  logRouteIsTryingToChangeStatus,
  logRouteIsWaitingForLoaders,
  logRouteIsWaitingForLoadersToRegister,
  logRouteIsWaitingForUnloaders,
  logRouteIsWaitingForUnloadersToRegister,
  logRouteResolvedAllLoaders,
  logRouteResolvedAllUnloaders,
} from "../logging"
import { RouteGroupContext } from "./RouteGroupContext"
import { createTimeout } from "@corets/promise-helpers"
import { useRouteLifeCycleController } from "./useRouteLifeCycleController"
import { useRouteRegistration } from "./useRouteRegistration"
import { RouteContext } from "./RouteContext"
import { RouteLifeCycleContext } from "./RouteLifeCycleContext"
import { RouteHandle, RouteLoader, RouteRenderer, RouteStatus } from "./types"
import { useRouter } from "../router"
import { useValue } from "@corets/use-value"

export type RouteProps = {
  path?: string
  exact?: boolean
  render?: RouteRenderer
  load?: RouteLoader
  children?: ReactNode | ComponentType
  wait?: number
  loadable?: boolean
  unloadable?: boolean
  controlled?: boolean
  debug?: boolean
}

export const Route = (props: RouteProps) => {
  const { render, load, children } = props
  const router = useRouter()

  if (!render && !load && !children) {
    throw new Error(
      `Route with path "${props.path}" does not provide any content `
    )
  }

  const debug = props?.debug ?? router.debug
  const wait = props.wait ?? router.wait
  const loadable = props.loadable ?? router.loadable
  const unloadable = props.unloadable ?? router.unloadable
  const controlled = props.controlled ?? router.controlled

  const { route, reportStatus } = useRouteRegistration({
    path: props.path ?? "/",
    exact: props.exact ?? false,
    debug,
  })
  const lifeCycle = useRouteLifeCycleController({
    path: route.path,
    loadable,
    unloadable,
    debug,
  })

  const routeHandle: RouteHandle = {
    path: route.path,
    exact: route.exact,
    status: route.status,
    params: route.params,
    query: route.query,
    loadable,
    unloadable,
    controlled,
    debug,
    isLoading: () =>
      [RouteStatus.Load, RouteStatus.Loaded].includes(route.status),
    isUnloading: () =>
      [RouteStatus.Unload, RouteStatus.Unload].includes(route.status),
    isShowing: () => route.status === RouteStatus.Shown,
  }

  const [Component, setComponent] = useState<ComponentType | null>(null)
  const checkLoaders = useValue(false)
  const checkUnloaders = useValue(false)

  useAsync(async () => {
    if (route.status === RouteStatus.Initialize) {
      debug &&
        logRouteIsTryingToChangeStatus(route.path, RouteStatus.Initialize)

      const component = await initializeComponent({
        path: route.path,
        children,
        render,
        load,
        debug,
      })
      // wrap into a function, otherwise it gets called immediately
      setComponent(() => component)
      reportStatus(RouteStatus.Initialized)
      debug && logRouteHasChangedStatus(route.path, RouteStatus.Initialized)

      return
    }

    if (route.status === RouteStatus.Load) {
      router.debug &&
        logRouteIsTryingToChangeStatus(route.path, RouteStatus.Load)
      router.debug && logRouteIsWaitingForLoadersToRegister(route.path, wait)

      // give loaders some time to register
      if (wait > 0) {
        await createTimeout(wait)
      }

      // enable monitoring of the life cycle loaders
      checkLoaders.set(true)

      return
    }

    if (route.status === RouteStatus.Unload) {
      router.debug &&
        logRouteIsTryingToChangeStatus(route.path, RouteStatus.Unload)
      router.debug && logRouteIsWaitingForUnloadersToRegister(route.path, wait)

      // give unloaders some time to register
      if (wait > 0) {
        await createTimeout(wait)
      }

      // enable monitoring of the life cycle unloaders
      checkUnloaders.set(true)

      return
    }

    if (route.status === RouteStatus.Show) {
      router.debug &&
        logRouteIsTryingToChangeStatus(route.path, RouteStatus.Show)
      reportStatus(RouteStatus.Shown)
      router.debug && logRouteHasChangedStatus(route.path, RouteStatus.Shown)

      return
    }

    if (route.status === RouteStatus.Idle) {
      checkLoaders.set(false)
      checkUnloaders.set(false)
      lifeCycle.clearLoaders()
      lifeCycle.clearUnloaders()

      return
    }
  }, [route.status])

  useEffect(() => {
    if (!checkLoaders.get()) return

    if (lifeCycle.isLoading()) {
      debug &&
        logRouteIsWaitingForLoaders(
          route.path,
          lifeCycle.getActiveLoadersCount()
        )
    } else {
      debug &&
        lifeCycle.getLoadersCount() > 0 &&
        logRouteResolvedAllLoaders(route.path, lifeCycle.getLoadersCount())
      reportStatus(RouteStatus.Loaded)
      debug && logRouteHasChangedStatus(route.path, RouteStatus.Loaded)
    }
  }, [checkLoaders.get(), lifeCycle.isLoading()])

  useEffect(() => {
    if (!checkUnloaders.get()) return

    if (lifeCycle.isUnloading()) {
      debug &&
        logRouteIsWaitingForUnloaders(
          route.path,
          lifeCycle.getActiveUnloadersCount()
        )
    } else {
      debug &&
        lifeCycle.getUnloadersCount() > 0 &&
        logRouteResolvedAllUnloaders(route.path, lifeCycle.getUnloadersCount())
      reportStatus(RouteStatus.Unloaded)
      debug && logRouteHasChangedStatus(route.path, RouteStatus.Unloaded)
    }
  }, [checkUnloaders.get(), lifeCycle.isUnloading()])

  if (!Component) {
    return null
  }

  const renderRoute = [
    RouteStatus.Load,
    RouteStatus.Loaded,
    RouteStatus.Unload,
    RouteStatus.Unloaded,
    RouteStatus.Show,
    RouteStatus.Shown,
  ].includes(route.status as any)

  const showRoute =
    renderRoute &&
    [
      RouteStatus.Show,
      RouteStatus.Shown,
      RouteStatus.Unload,
      RouteStatus.Unloaded,
    ].includes(route.status as any) &&
    !lifeCycle.isLoading()

  return (
    <RouteContext.Provider value={routeHandle}>
      {renderRoute ? (
        <div
          className="shadowed-route"
          style={
            controlled
              ? {}
              : {
                  width: "100%",
                  height: "100%",
                  display: showRoute ? "block" : "none",
                }
          }
        >
          <RouteGroupContext.Provider value={undefined}>
            <RouteLifeCycleContext.Provider value={lifeCycle}>
              <Component {...route.params} />
            </RouteLifeCycleContext.Provider>
          </RouteGroupContext.Provider>
        </div>
      ) : null}
    </RouteContext.Provider>
  )
}

type InitializeComponentArgs = {
  debug: boolean
  path: string
  children?: ReactNode
  render?: RouteRenderer
  load?: RouteLoader
}
const initializeComponent = async (
  args: InitializeComponentArgs
): Promise<ComponentType> => {
  const { debug, path, children, render, load } = args

  try {
    if (children) {
      if (isValidElement(children)) {
        return () => <>{children}</>
      } else {
        if (Array.isArray(children) || typeof children === "string") {
          return () => <>{children}</>
        }

        return children as ComponentType
      }
    }

    if (render) {
      if (isValidElement(render)) {
        debug && logRouteInitializedWithElement(path)
        return () => <>{render}</>
      } else {
        debug && logRouteInitializedWithComponent(path)
        return render as ComponentType
      }
    }

    if (load) {
      debug && logRouteIsLoadingInitializer(path)

      const component = await load()

      debug && logRouteHasLoadedInitializer(path)

      if (isValidElement(component)) {
        debug && logRouteInitializedWithElement(path)
        return () => <>{component}</>
      } else {
        debug && logRouteInitializedWithComponent(path)
        return component as ComponentType
      }
    }

    throw new Error(`Route does not provide a loader or a renderer`)
  } catch (err) {
    console.error(`Error in route with path "${path}"`)
    throw err
  }
}
