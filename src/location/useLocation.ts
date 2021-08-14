import { UseLocation } from "./types"
import { useHistory } from "./useHistory"

export const useLocation: UseLocation = (history) =>
  useHistory(history).location
