import { useRoute } from "./useRoute"
import { UseRouteIsUnloading } from "./types"

export const useRouteIsUnloading: UseRouteIsUnloading = () =>
  useRoute().isUnloading()
