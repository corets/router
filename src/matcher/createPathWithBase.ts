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

  return [base, path].join("/").replace(/\/+/g, "/")
}
