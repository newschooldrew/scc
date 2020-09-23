import React from 'react'
import useErrorBoundary from "use-error-boundary"

const ErrorBoundary = ({children}) => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary()
 
  return (
    <>
      {didCatch ? (
        <p>An error has been caught</p>
      ) : (
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      )}
    </>
  )
}

export default ErrorBoundary