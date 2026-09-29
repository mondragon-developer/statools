import React from 'react';

// react-spline rethrows scene load failures during render (blocked CDN, no WebGL).
// Without a boundary that would unmount the whole app, so decorative 3D just disappears.
class QuietBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}

export default QuietBoundary;
