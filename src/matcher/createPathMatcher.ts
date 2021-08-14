// This is an adjusted version of this file:
// https://github.com/molefrog/wouter/blob/master/matcher.js

import { CreatePathMatcher, PathMatcher } from "./types"
import { pathToRegex, PathToRegexResult } from "./helpers/pathToRegex"
import { createPathWithBase } from "./createPathWithBase"

export const createPathMatcher: CreatePathMatcher = (): PathMatcher => {
  const cache: Record<string, PathToRegexResult> = {}

  const pathMatcher: PathMatcher = (pattern, path, options) => {
    const base = options?.base ?? "/"
    const exact = options?.exact ?? false

    const greedyPattern =
      exact === true ? pattern : `${pattern === "/" ? "" : pattern}/:rest*`
    const finalPattern = createPathWithBase(greedyPattern, base)

    if (!cache[finalPattern]) {
      cache[finalPattern] = pathToRegex(finalPattern)
    }

    const { regexp, keys } = cache[finalPattern]
    const regexResult = regexp.exec(path)

    if (!regexResult) return [false, undefined]

    // formats an object with matched params
    const params = keys.reduce((params, key, i) => {
      params[key.name] = regexResult[i + 1]
      return params
    }, {} as any)

    return [true, params]
  }

  return pathMatcher
}
