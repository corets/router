export const createPathWithBase = (
  path: string,
  base: string = "/"
): string => {
  const isExternalPath = ["http", "https", "//"].find((prefix) =>
    path.startsWith(prefix)
  )

  if (isExternalPath) {
    return path
  }

  const pathWithBase = [base, path].join("/").replace(/\/+/g, "/")

  if (pathWithBase !== "/") {
    return pathWithBase.replace(/\/+$/, "")
  }

  return pathWithBase
}
