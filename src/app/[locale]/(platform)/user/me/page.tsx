"use client";

import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import { UserProfileCard } from "@/components/users/user-profile-card";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UserProfilePage() {
  const user = useContext(UserContext);
  const router = useRouter();
  const t = useTranslations("dashboard");

  if (!user) return <div className="p-6">{t('user.loading')}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('user.back')}
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
