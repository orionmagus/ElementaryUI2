import React from "react";
export const useQueue = (...funcs) =>
  funcs.forEach(([fn, ...args], i) => fn.call(null, args));
export const DefaultFallbackComponent = props => {
  console.log(props);
  return (
    <div>
      <p>
        <strong>An error has occured</strong>
      </p>
    </div>
  );
};
export const DefaultErrorHandler = (error, info) => console.log(error, info);

export class ErrorBoundary extends React.Component {
  static defaultProps = {
    FallbackComponent: DefaultFallbackComponent,
    errorHandler: DefaultErrorHandler
  };
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    this.props.errorHandler(error, info);
  }

  render() {
    const { FallbackComponent } = this.props;
    return this.state.hasError ? (
      <FallbackComponent error={this.state.error} />
    ) : (
      this.props.children
    );
  }
}
export default WrappedComponent => props => (
  <ErrorBoundary {...props}>
    <WrappedComponent />
  </ErrorBoundary>
);
