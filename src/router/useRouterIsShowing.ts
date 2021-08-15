import { useRouter } from "./useRouter"
import { UseRouterIsShowing } from "./types"

export const useRouterIsShowing: UseRouterIsShowing = () =>
  useRouter().isShowing()
