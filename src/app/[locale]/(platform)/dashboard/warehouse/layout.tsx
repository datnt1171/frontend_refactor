import { getMaxSalesDate } from '@/lib/api/server';
import { getTranslations } from 'next-intl/server';

export default async function WarehouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations();
  const maxSalesDate = await getMaxSalesDate();

  return (
    <div>
      <div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-1 pb-1 rounded">
          <span className="size-1.5 rounded-full bg-blue-500" />
          {t('dashboard.latestData')}: {maxSalesDate}
        </span>
      </div>
      {children}
    </div>
  );
}