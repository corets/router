export type CreatePathMatcher = () => PathMatcher

export type PathMatcher = <TParams extends MatchedParams>(
  pattern: string,
  path: string,
  options?: { base?: string; exact?: boolean }
) => MatchedPath<TParams>

export type MatchedPath<TParams extends MatchedParams = MatchedParams> = [
  boolean,
  TParams | undefined
]

export type MatchedParams = Record<string, string>
