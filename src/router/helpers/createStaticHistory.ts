import { createMemoryHistory, History } from "history"

export const createStaticHistory = (path: string): History => {
  const history = createMemoryHistory()

  history.push(path)

  return history
}
