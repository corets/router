import {
  logRouteDetectedNewLoader,
  logRouteDetectedNewUnloader,
} from "../logging"
import { useValue } from "@corets/use-value"
import { RouteLifeCycleHandle } from "./types"

export const useRouteLifeCycleController = (args: {
  path: string
  loadable: boolean
  unloadable: boolean
  debug: boolean
}): RouteLifeCycleHandle => {
  const { path, loadable, unloadable, debug } = args
  const loaderIds = useValue<number[]>([])
  const activeLoaderIds = useValue<number[]>([])
  const unloaderIds = useValue<number[]>([])
  const activeUnloaderIds = useValue<number[]>([])

  const startLoading = (id: number) => {
    if (!loadable) return

    if (!loaderIds.get().includes(id)) {
      loaderIds.set([...loaderIds.get(), id])
      activeLoaderIds.set([...activeLoaderIds.get(), id])

      debug && logRouteDetectedNewLoader(path, loaderIds.get().length)
    }
  }

  const startUnloading = (id: number) => {
    if (!unloadable) return

    if (!unloaderIds.get().includes(id)) {
      unloaderIds.set([...unloaderIds.get(), id])
      activeUnloaderIds.set([...activeUnloaderIds.get(), id])

      debug && logRouteDetectedNewUnloader(path, unloaderIds.get().length)
    }
  }

  const stopLoading = (id: number) => {
    if (!loadable) return

    if (activeLoaderIds.get().includes(id)) {
      activeLoaderIds.set(activeLoaderIds.get().filter((i) => i !== id))
    }
  }

  const stopUnloading = (id: number) => {
    if (!loadable) return

    if (activeUnloaderIds.get().includes(id)) {
      activeUnloaderIds.set(activeUnloaderIds.get().filter((i) => i !== id))
    }
  }

  const isLoaderRunning = (id: number) => activeLoaderIds.get().includes(id)

  const isUnloaderRunning = (id: number) => activeUnloaderIds.get().includes(id)

  const getLoadersCount = () => loaderIds.get().length

  const getUnloadersCount = () => unloaderIds.get().length

  const getActiveLoadersCount = () => activeLoaderIds.get().length

  const getActiveUnloadersCount = () => activeUnloaderIds.get().length

  const clearLoaders = () => {
    loaderIds.set([])
    activeLoaderIds.set([])
  }

  const clearUnloaders = () => {
    unloaderIds.set([])
    activeUnloaderIds.set([])
  }

  const isLoading = () => activeLoaderIds.get().length > 0

  const isUnloading = () => activeUnloaderIds.get().length > 0

  const createLoader = () => {
    const id = Math.random()

    return {
      isRunning: () => isLoaderRunning(id),
      start: () => startLoading(id),
      stop: () => stopLoading(id),
    }
  }

  const createUnloader = () => {
    const id = Math.random()

    return {
      isRunning: () => isUnloaderRunning(id),
      start: () => startUnloading(id),
      stop: () => stopUnloading(id),
    }
  }

  return {
    isLoading,
    isUnloading,
    getLoadersCount,
    getUnloadersCount,
    getActiveLoadersCount,
    getActiveUnloadersCount,
    createLoader,
    createUnloader,
    clearLoaders,
    clearUnloaders,
  }
}
