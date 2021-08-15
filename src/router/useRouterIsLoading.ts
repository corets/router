import { useRouter } from "./useRouter"
import { UseRouterIsLoading } from "./types"

export const useRouterIsLoading: UseRouterIsLoading = () =>
  useRouter().isLoading()
