import { getCurrentUser } from "@/lib/api";
import { UserProfileCard } from "@/components/users/user-profile-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function UserProfilePage() {
  const t = await getTranslations("dashboard");
  
  const { data: user } = await getCurrentUser();

  if (!user) return <div className="p-6">{t('user.loading')}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <Button asChild variant="outline">
          <Link href="/task-management/dashboard/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('user.back')}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/user/me/change-password">
            {t('user.changePassword')}
          </Link>
        </Button>
      </div>
      <UserProfileCard user={user} />
    </div>
  );
}
