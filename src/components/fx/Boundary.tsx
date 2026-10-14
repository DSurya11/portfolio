import { Component, type ReactNode } from 'react';

// Keeps a failing 3D widget (no WebGL, lost GPU context) from taking the page down with it.
export class Boundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
