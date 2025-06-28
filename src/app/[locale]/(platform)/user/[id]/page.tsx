import { getUser } from "@/lib/api/server"
import { getTranslations } from "next-intl/server"
import BackButton from "@/components/ui/BackButton"

export default async function UserDetailPage({ params }: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const t = await getTranslations("user")
  const user = await getUser(id)

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded shadow">
      <BackButton />
      <h1 className="text-xl font-bold mb-4">{t('userDetail')}</h1>
      <div className="mb-2"><span className="font-semibold">{t('username')}:</span> {user.username}</div>
      <div className="mb-2"><span className="font-semibold">{t('lastName')}:</span> {user.last_name || "-"}</div>
      <div className="mb-2"><span className="font-semibold">{t('firstName')}:</span> {user.first_name || "-"}</div>
    </div>
  )
}