import { useRoute } from "./useRoute"
import { UseRouteIsShowing } from "./types"

export const useRouteIsShowing: UseRouteIsShowing = () => useRoute().isShowing()
