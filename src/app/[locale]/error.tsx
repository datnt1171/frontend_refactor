'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error); // Log error for debugging
  }, [error]);

  return (
    <div className="text-center mt-32">
      <h1 className="text-2xl font-semibold text-red-600">Something went wrong.</h1>
      <p className="mt-2 text-gray-700">
        {process.env.NODE_ENV === 'development' ? error.message : 'Please try again later.'}
      </p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}
