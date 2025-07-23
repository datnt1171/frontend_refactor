'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  useEffect(() => {
    // Log error with more context for debugging
    console.error('Error boundary caught:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString()
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            {t('errorTitle')}
          </h1>
          <p className="text-gray-600">
            {process.env.NODE_ENV === 'development'
              ? error.message
              : t('errorDescription')}
          </p>
          
          {/* Show error digest in development for debugging */}
          {process.env.NODE_ENV === 'development' && error.digest && (
            <p className="text-xs text-gray-400 mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {t('tryAgain')}
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            {t('goHome')}
          </button>
        </div>

        {/* Only show in development */}
        {process.env.NODE_ENV === 'development' && error.stack && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Stack Trace (Development Only)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}