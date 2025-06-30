"use client";

import { useState } from "react";
import { changePassword } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import BackButton from "@/components/ui/BackButton";
import { useTranslations } from 'next-intl'

export default function ChangePasswordPage() {
  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [re_new_password, setReNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('user.changePassword')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await changePassword({ current_password, new_password, re_new_password });
      setSuccess(t('passwordChangedSuccess'));
      setCurrentPassword("");
      setNewPassword("");
      setReNewPassword("");
      setTimeout(() => {
        router.push("/user/me");
      }, 1200);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        t('passwordChangeFailed')
      );
    } finally {
      setLoading(false);
    }
  };

  const isMinLength = new_password.length >= 9;
  const isNotNumeric = !/^\d+$/.test(new_password) || new_password.length === 0; // Allow empty string to avoid premature red
  // Add more checks if you want (e.g. isNotCommon, isNotSimilar)

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="mb-4">
        <BackButton />
      </div>
      <h1 className="text-2xl font-bold mb-6">{t('changePassword')}</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="current_password">{t('currentPassword')}</Label>
          <Input
            id="current_password"
            type="password"
            value={current_password}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="new_password">{t('newPassword')}</Label>
          <Input
            id="new_password"
            type="password"
            value={new_password}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          {new_password && (
            <div className="text-xs mt-1 space-y-1">
              <p className={isMinLength ? 'text-green-600' : 'text-red-500'}>
                • {t('passwordMinLength')}
              </p>
              <p className={isNotNumeric ? 'text-green-600' : 'text-red-500'}>
                • {t('passwordNotNumeric')}
              </p>
              {/* Extend with other rules if you want */}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="re_new_password">{t('confirmNewPassword')}</Label>
          <Input
            id="re_new_password"
            type="password"
            value={re_new_password}
            onChange={e => setReNewPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t('changing') : t('changePassword')}
        </Button>
      </form>
    </div>
  );
}
