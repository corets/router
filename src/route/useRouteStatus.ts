import { useRoute } from "./useRoute"
import { UseRouteStatus } from "./types"

export const useRouteStatus: UseRouteStatus = () => useRoute().status
