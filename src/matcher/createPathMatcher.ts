// This is an adjusted version of this file:
// https://github.com/molefrog/wouter/blob/master/matcher.js

import { CreatePathMatcher, PathMatcher } from "./types"
import { pathToRegex, PathToRegexResult } from "./helpers/pathToRegex"
import { createPathWithBase } from "./createPathWithBase"

const REST_PARAMETER_NAME = "rest_parameter_name"

export const createPathMatcher: CreatePathMatcher = (): PathMatcher => {
  const cache: Record<string, PathToRegexResult> = {}

  const pathMatcher: PathMatcher = (pattern, path, options) => {
    const base = options?.base ?? "/"
    const exact = options?.exact ?? false

    const greedyPattern =
      exact === true
        ? pattern
        : `${pattern === "/" ? "" : pattern}/:${REST_PARAMETER_NAME}*`
    const finalPattern = createPathWithBase(greedyPattern, base)
    const cacheKey = `${finalPattern}/${exact ? 1 : 0}`

    if (!cache[cacheKey]) {
      cache[cacheKey] = pathToRegex(finalPattern)
    }

    const { regexp, keys } = cache[cacheKey]
    const regexResult = regexp.exec(path)

    if (!regexResult) return [false, null]

    // formats an object with matched params
    const params = keys.reduce((params, key, i) => {
      params[key.name] = regexResult[i + 1] ?? null
      return params
    }, {} as any)

    delete params[REST_PARAMETER_NAME]

    return [true, params]
  }

  return pathMatcher
}
