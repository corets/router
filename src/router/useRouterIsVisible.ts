import { useRouter } from "./useRouter"
import { UseRouterIsVisible } from "./types"

export const useRouterIsVisible: UseRouterIsVisible = () =>
  useRouter().isVisible()
