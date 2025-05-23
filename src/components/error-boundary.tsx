'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component for graceful error handling
 * Catches JavaScript errors in child component tree and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, use the default error UI
      return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                An error occurred while rendering this component. We apologize for the inconvenience.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="text-sm bg-muted p-4 rounded-md overflow-auto max-h-[200px]">
                  <p className="font-semibold">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={this.handleReset} className="w-full">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

/**
 * ErrorFallback component for use with ErrorBoundary
 * Provides a simple fallback UI for error states
 */
export function ErrorFallback(): ReactNode {
  return (
    <div className="p-6 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">
        We're sorry, but we couldn't display this content.
      </p>
      <Button onClick={() => window.location.reload()}>
        Reload Page
      </Button>
    </div>
  );
}
