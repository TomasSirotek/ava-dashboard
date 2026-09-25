import { Component } from "react"
import type { IModelBoundaryProps } from "@/features/viewport/viewport.interface"

// Lives inside the Canvas; reports failures up so the message renders as plain DOM.
// Error boundaries still have no hook equivalent, so this stays a class.
export class ModelBoundary extends Component<IModelBoundaryProps, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}
