import { useRoute } from "./useRoute"
import { UseRouteIsVisible } from "./types"

export const useRouteIsVisible: UseRouteIsVisible = () => useRoute().isVisible()
