import { useRouter } from "./useRouter"
import { UseRouterIsUnloading } from "./types"

export const useRouterIsUnloading: UseRouterIsUnloading = () =>
  useRouter().isUnloading()
