'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations('root');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center mt-32">
      <h1 className="text-2xl font-semibold text-red-600">
        {t('errorTitle')}
      </h1>
      <p className="mt-2 text-gray-700">
        {process.env.NODE_ENV === 'development'
          ? error.message
          : t('errorDescription')}
      </p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {t('tryAgain')}
      </button>
    </div>
  );
}
