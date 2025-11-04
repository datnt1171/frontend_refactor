import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Briefcase, Users, Bell } from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/api/server";
import { NotificationToggle } from "@/components/ui/NotificationToggle";

export default async function UserProfilePage() {
  const user = await getCurrentUser()
  const t = await getTranslations("user");

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <BackButton />
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/me/change-password">
              {t('changePassword.changePassword')}
            </Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>
                {user.last_name} {user.first_name}
              </CardTitle>
              <div className="text-gray-500 text-sm">@{user.username}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-2">
                <span>{t('department')}:</span>
                <Badge variant="secondary">{user.department.name}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-2">
                <span>{t('role')}:</span>
                <Badge variant="secondary">{user.role.name}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <span>
                {t('supervisor')}: {user.supervisor.last_name} {user.supervisor.first_name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <NotificationToggle 
                currentDeviceId={user.current_device_id}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}