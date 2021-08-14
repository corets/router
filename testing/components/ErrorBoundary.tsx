import { Component, ReactNode } from "react"

export class ErrorBoundary extends Component<{
  children: ReactNode
  fallback: (error?: any) => ReactNode
}> {
  state = {
    error: null,
  }

  componentDidCatch(error) {
    this.setState({ error })
  }

  render() {
    return this.state.error
      ? this.props.fallback(this.state.error)
      : this.props.children
  }
}
