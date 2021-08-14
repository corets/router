import { useRoute } from "./useRoute"
import { UseRouteIsLoading } from "./types"

export const useRouteIsLoading: UseRouteIsLoading = () => useRoute().isLoading()
