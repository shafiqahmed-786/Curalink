import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production you can send this to a monitoring tool (e.g. Sentry)
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Allow the parent to supply a completely custom fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.card} role="alert" aria-live="assertive">
          <span className={styles.icon} aria-hidden="true">⚠</span>
          <p className={styles.title}>Something went wrong</p>
          <p className={styles.detail}>
            {this.props.message ||
              'An unexpected error occurred while rendering this section.'}
          </p>
          <button className={styles.retryBtn} onClick={this.handleReset}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
