// escapes a regexp string (borrowed from path-to-regexp sources)
// https://github.com/pillarjs/path-to-regexp/blob/v3.0.0/index.js#L202

export type PathToRegexResult = {
  keys: Array<{ name: string | number }>
  regexp: RegExp
}

export const pathToRegex = (pattern: string): PathToRegexResult => {
  const groupRx = /:([A-Za-z0-9_]+)([?+*]?)/g

  let match: RegExpExecArray | null = null,
    lastIndex = 0,
    keys: { name: string }[] = [],
    result = ""

  pattern =
    pattern[pattern.length - 1] === "/"
      ? pattern.substring(0, pattern.length - 1)
      : pattern

  while ((match = groupRx.exec(pattern)) !== null) {
    const [_, segment, mod] = match

    // :foo  [1]      (  )
    // :foo? [0 - 1]  ( o)
    // :foo+ [1 - ∞]  (r )
    // :foo* [0 - ∞]  (ro)
    const repeat = mod === "+" || mod === "*"
    const optional = mod === "?" || mod === "*"
    const prefix = optional && pattern[match.index - 1] === "/" ? 1 : 0

    const prev = pattern.substring(lastIndex, match.index - prefix)

    keys.push({ name: segment })
    lastIndex = groupRx.lastIndex

    result += escapeRx(prev) + rxForSegment(repeat, optional, prefix)
  }

  result += escapeRx(pattern.substring(lastIndex))

  return { keys, regexp: new RegExp("^" + result + "(?:\\/)?$", "i") }
}

const escapeRx = (string: string): string =>
  string.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1")

// returns a segment representation in RegExp based on flags
// adapted and simplified version from path-to-regexp sources
const rxForSegment = (
  repeat: boolean,
  optional: boolean,
  prefix: 0 | 1
): string => {
  let capture = repeat ? "((?:[^\\/]+?)(?:\\/(?:[^\\/]+?))*)" : "([^\\/]+?)"
  if (optional && prefix) capture = "(?:\\/" + capture + ")"
  return capture + (optional ? "?" : "")
}
