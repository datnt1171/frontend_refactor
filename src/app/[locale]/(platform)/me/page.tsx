import { UserProfileCard } from "@/components/users/user-profile-card";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/api/server";

export default async function UserProfilePage() {
  const user = await getCurrentUser()
  const t = await getTranslations("user");

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <BackButton />
        <Button asChild variant="outline">
          <Link href="/me/change-password">
            {t('changePassword.changePassword')}
          </Link>
        </Button>
      </div>
      <UserProfileCard user={user} />
    </div>
  );
}
