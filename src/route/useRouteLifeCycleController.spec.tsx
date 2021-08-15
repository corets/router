import React from "react"
import { useRouteLifeCycleController } from "./useRouteLifeCycleController"
import { act, render } from "@testing-library/react"
import { RouteLifeCycleHandle } from "./types"

describe("useRouteLifeCycleController", () => {
  it("controls loaders", () => {
    let controller: RouteLifeCycleHandle

    const Test = () => {
      controller = useRouteLifeCycleController({
        path: "/",
        loadable: true,
        unloadable: true,
        debug: false,
      })

      return null
    }

    render(<Test />)

    expect(controller!).toBeDefined()
    expect(controller!.isLoading()).toBe(false)
    expect(controller!.getLoadersCount()).toBe(0)
    expect(controller!.getActiveLoadersCount()).toBe(0)

    const loader = controller!.createLoader()

    expect(controller!.isLoading()).toBe(false)
    expect(controller!.getLoadersCount()).toBe(0)
    expect(controller!.getActiveLoadersCount()).toBe(0)
    expect(loader.isRunning()).toBe(false)

    act(() => loader.start())

    expect(controller!.isLoading()).toBe(true)
    expect(controller!.getLoadersCount()).toBe(1)
    expect(controller!.getActiveLoadersCount()).toBe(1)
    expect(loader.isRunning()).toBe(true)

    const anotherLoader = controller!.createLoader()

    act(() => anotherLoader.start())

    expect(controller!.isLoading()).toBe(true)
    expect(controller!.getLoadersCount()).toBe(2)
    expect(controller!.getActiveLoadersCount()).toBe(2)
    expect(anotherLoader.isRunning()).toBe(true)

    act(() => anotherLoader.stop())

    expect(controller!.isLoading()).toBe(true)
    expect(controller!.getLoadersCount()).toBe(2)
    expect(controller!.getActiveLoadersCount()).toBe(1)
    expect(anotherLoader.isRunning()).toBe(false)

    act(() => loader.stop())

    expect(controller!.isLoading()).toBe(false)
    expect(controller!.getLoadersCount()).toBe(2)
    expect(controller!.getActiveLoadersCount()).toBe(0)
    expect(loader.isRunning()).toBe(false)
  })

  it("controls unloaders", () => {
    let controller: RouteLifeCycleHandle

    const Test = () => {
      controller = useRouteLifeCycleController({
        path: "/",
        loadable: true,
        unloadable: true,
        debug: false,
      })

      return null
    }

    render(<Test />)

    expect(controller!).toBeDefined()
    expect(controller!.isUnloading()).toBe(false)
    expect(controller!.getUnloadersCount()).toBe(0)
    expect(controller!.getActiveUnloadersCount()).toBe(0)

    const unloader = controller!.createUnloader()

    expect(controller!.isUnloading()).toBe(false)
    expect(controller!.getUnloadersCount()).toBe(0)
    expect(controller!.getActiveUnloadersCount()).toBe(0)
    expect(unloader.isRunning()).toBe(false)

    act(() => unloader.start())

    expect(controller!.isUnloading()).toBe(true)
    expect(controller!.getUnloadersCount()).toBe(1)
    expect(controller!.getActiveUnloadersCount()).toBe(1)
    expect(unloader.isRunning()).toBe(true)

    const anotherUnloader = controller!.createUnloader()

    act(() => anotherUnloader.start())

    expect(controller!.isUnloading()).toBe(true)
    expect(controller!.getUnloadersCount()).toBe(2)
    expect(controller!.getActiveUnloadersCount()).toBe(2)
    expect(anotherUnloader.isRunning()).toBe(true)

    act(() => anotherUnloader.stop())

    expect(controller!.isUnloading()).toBe(true)
    expect(controller!.getUnloadersCount()).toBe(2)
    expect(controller!.getActiveUnloadersCount()).toBe(1)
    expect(anotherUnloader.isRunning()).toBe(false)

    act(() => unloader.stop())

    expect(controller!.isUnloading()).toBe(false)
    expect(controller!.getUnloadersCount()).toBe(2)
    expect(controller!.getActiveUnloadersCount()).toBe(0)
    expect(unloader.isRunning()).toBe(false)
  })

  it("clears loaders", () => {
    let controller: RouteLifeCycleHandle

    const Test = () => {
      controller = useRouteLifeCycleController({
        path: "/",
        loadable: true,
        unloadable: true,
        debug: false,
      })

      return null
    }

    render(<Test />)

    const loader = controller!.createLoader()

    expect(controller!.isLoading()).toBe(false)
    expect(controller!.getLoadersCount()).toBe(0)
    expect(controller!.getActiveLoadersCount()).toBe(0)
    expect(loader.isRunning()).toBe(false)

    act(() => loader.start())

    expect(controller!.isLoading()).toBe(true)
    expect(controller!.getLoadersCount()).toBe(1)
    expect(controller!.getActiveLoadersCount()).toBe(1)
    expect(loader.isRunning()).toBe(true)

    act(() => controller.clearLoaders())

    expect(controller!.isLoading()).toBe(false)
    expect(controller!.getLoadersCount()).toBe(0)
    expect(controller!.getActiveLoadersCount()).toBe(0)
    expect(loader.isRunning()).toBe(false)
  })

  it("clears unloaders", () => {
    let controller: RouteLifeCycleHandle

    const Test = () => {
      controller = useRouteLifeCycleController({
        path: "/",
        loadable: true,
        unloadable: true,
        debug: false,
      })

      return null
    }

    render(<Test />)

    const unloader = controller!.createUnloader()

    expect(controller!.isUnloading()).toBe(false)
    expect(controller!.getUnloadersCount()).toBe(0)
    expect(controller!.getActiveUnloadersCount()).toBe(0)
    expect(unloader.isRunning()).toBe(false)

    act(() => unloader.start())

    expect(controller!.isUnloading()).toBe(true)
    expect(controller!.getUnloadersCount()).toBe(1)
    expect(controller!.getActiveUnloadersCount()).toBe(1)
    expect(unloader.isRunning()).toBe(true)

    act(() => controller.clearUnloaders())

    expect(controller!.isUnloading()).toBe(false)
    expect(controller!.getUnloadersCount()).toBe(0)
    expect(controller!.getActiveUnloadersCount()).toBe(0)
    expect(unloader.isRunning()).toBe(false)
  })

  it("can ignore loaders", () => {
    let controller: RouteLifeCycleHandle

    const Test = () => {
      controller = useRouteLifeCycleController({
        path: "/",
        loadable: false,
        unloadable: true,
        debug: false,
      })

      return null
    }

    render(<Test />)

    const loader = controller!.createLoader()

    expect(controller!.isLoading()).toBe(false)
    expect(controller!.getLoadersCount()).toBe(0)
    expect(controller!.getActiveLoadersCount()).toBe(0)
    expect(loader.isRunning()).toBe(false)

    act(() => loader.start())

    expect(controller!.isLoading()).toBe(false)
    expect(controller!.getLoadersCount()).toBe(0)
    expect(controller!.getActiveLoadersCount()).toBe(0)
    expect(loader.isRunning()).toBe(false)
  })

  it("can ignore unloaders", () => {
    let controller: RouteLifeCycleHandle

    const Test = () => {
      controller = useRouteLifeCycleController({
        path: "/",
        loadable: true,
        unloadable: false,
        debug: false,
      })

      return null
    }

    render(<Test />)

    const unloader = controller!.createUnloader()

    expect(controller!.isUnloading()).toBe(false)
    expect(controller!.getUnloadersCount()).toBe(0)
    expect(controller!.getActiveUnloadersCount()).toBe(0)
    expect(unloader.isRunning()).toBe(false)

    act(() => unloader.start())

    expect(controller!.isUnloading()).toBe(false)
    expect(controller!.getUnloadersCount()).toBe(0)
    expect(controller!.getActiveUnloadersCount()).toBe(0)
    expect(unloader.isRunning()).toBe(false)
  })
})
