import { getTranslations } from 'next-intl/server';

interface DataStatusBadgeProps {
  date: string;
  label?: string;
}

export async function DataStatusBadge({ date, label }: DataStatusBadgeProps) {
  const t = await getTranslations();

  return (
    <div className="pb-1">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-1 pb-1 rounded">
      <span className="size-1.5 rounded-full bg-blue-500" />
        {label || t('dashboard.latestData')}: {date}
      </span>
    </div>
    
  );
}