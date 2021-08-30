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
import { createTimeout } from "@corets/promise-helpers"
import { useRouteLifeCycleController } from "./useRouteLifeCycleController"
import { useRouteRegistration } from "./useRouteRegistration"
import { RouteContext } from "./RouteContext"
import { RouteLifeCycleContext } from "./RouteLifeCycleContext"
import { RouteHandle, RouteLoader, RouteRenderer, RouteStatus } from "./types"
import { Group, useRouter } from "../router"
import { useValue } from "@corets/use-value"
import { Memo } from "@corets/memo"

export type RouteProps = {
  path?: string
  exact?: boolean
  wait?: number
  loadable?: boolean
  unloadable?: boolean
  controlled?: boolean
  disabled?: boolean
  debug?: boolean
}

export type RoutePropsWithChildren = RouteProps & {
  children: ReactNode | ComponentType
}

export type RoutePropsWithRenderer = RouteProps & {
  render: RouteRenderer
}

export type RoutePropsWithLoader = RouteProps & {
  load: RouteLoader
}

export const Route = (
  props: RoutePropsWithChildren | RoutePropsWithRenderer | RoutePropsWithLoader
) => {
  const router = useRouter()

  if (!render && !load && !children) {
    throw new Error(
      `Route with path "${props.path}" does not provide any content `
    )
  }

  const {
    route,
    reportStatus,
    loadable,
    unloadable,
    controlled,
    disabled,
    wait,
    debug,
  } = useRouteRegistration({
    path: props.path ?? "/",
    exact: props.exact ?? false,
    loadable: props.loadable,
    unloadable: props.unloadable,
    controlled: props.controlled,
    disabled: props.disabled,
    wait: props.wait,
    debug: props.debug,
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
    disabled,
    debug,
    isLoading: () =>
      [RouteStatus.Load, RouteStatus.Loaded].includes(route.status),
    isUnloading: () =>
      [RouteStatus.Unload, RouteStatus.Unloaded].includes(route.status),
    isVisible: () =>
      [RouteStatus.Visible, RouteStatus.Unload, RouteStatus.Unloaded].includes(
        route.status
      ),
    redirect: router.redirect,
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

      // give loaders some time to register
      if (wait > 0) {
        router.debug && logRouteIsWaitingForLoadersToRegister(route.path, wait)
        await createTimeout(wait)
      }

      // enable monitoring of the life cycle loaders
      checkLoaders.set(true)

      return
    }

    if (route.status === RouteStatus.Unload) {
      router.debug &&
        logRouteIsTryingToChangeStatus(route.path, RouteStatus.Unload)

      // give unloaders some time to register
      if (wait > 0) {
        router.debug &&
          logRouteIsWaitingForUnloadersToRegister(route.path, wait)
        await createTimeout(wait)
      }

      // enable monitoring of the life cycle unloaders
      checkUnloaders.set(true)

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
    RouteStatus.Visible,
  ].includes(route.status as any)

  const showRoute =
    [RouteStatus.Visible, RouteStatus.Unload, RouteStatus.Unloaded].includes(
      route.status as any
    ) && !lifeCycle.isLoading()

  return (
    <Memo deps={[JSON.stringify(routeHandle)]}>
      <RouteContext.Provider value={routeHandle}>
        {renderRoute ? (
          <Group
            groupId={null}
            loadable={loadable}
            unloadable={unloadable}
            controlled={controlled}
            disabled={disabled}
            debug={debug}
            wait={wait}
          >
            <RouteLifeCycleContext.Provider value={lifeCycle}>
              {controlled ? (
                <Component {...route.params} />
              ) : (
                <div
                  className="corets-route"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: showRoute ? "block" : "none",
                  }}
                >
                  <Component {...route.params} />
                </div>
              )}
            </RouteLifeCycleContext.Provider>
          </Group>
        ) : null}
      </RouteContext.Provider>
    </Memo>
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
