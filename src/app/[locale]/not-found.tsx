import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations();
  return (
    <div className="text-center mt-32">
      <h1 className="text-3xl font-bold">{t('common.notFoundTitle')}</h1>
      <p className="text-gray-600 mt-2">{t('common.notFoundDescription')}</p>
    </div>
  );
}
