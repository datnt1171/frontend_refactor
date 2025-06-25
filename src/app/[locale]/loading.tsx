import { getTranslations } from 'next-intl/server';
import { Loader2 } from "lucide-react";

export default async function Loading() {
  const t = await getTranslations('common');
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="ml-2 text-muted-foreground">
        {t('loading')}
      </span>
    </div>
  );
}