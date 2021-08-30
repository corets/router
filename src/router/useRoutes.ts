import { UseRoutes } from "./types"
import { useRouter } from "./useRouter"

export const useRoutes: UseRoutes = () => useRouter().getRoutes()
