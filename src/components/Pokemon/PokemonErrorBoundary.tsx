import React, { useState, useEffect } from 'react';

interface PokemonErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

export const PokemonErrorBoundary: React.FC<PokemonErrorBoundaryProps> = ({ children, onRetry }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent | PromiseRejectionEvent) => {
      console.error('PokemonList error:', event);
      setHasError(true);
    };

    window.addEventListener('error', handleError as EventListener);
    window.addEventListener('unhandledrejection', handleError as EventListener);

    return () => {
      window.removeEventListener('error', handleError as EventListener);
      window.removeEventListener('unhandledrejection', handleError as EventListener);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Something went wrong!</h2>
        <button
          onClick={onRetry || (() => window.location.reload())}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {onRetry ? 'Retry' : 'Try Again'}
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
