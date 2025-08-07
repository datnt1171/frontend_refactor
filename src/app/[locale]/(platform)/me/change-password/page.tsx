"use client";

import { useState } from "react";
import { changePassword } from "@/lib/api/client/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from 'next-intl'
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Link } from "@/i18n/navigation";

export default function ChangePasswordPage() {
  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [re_new_password, setReNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      const response = await changePassword({ current_password, new_password, re_new_password });
      if (!response.ok) {
        setError(
        response.data.error ||
        t('passwordChangeFailed')
      );
      } else {
      setSuccess(t('passwordChangedSuccess'));
      setCurrentPassword("");
      setNewPassword("");
      setReNewPassword("");
      setTimeout(() => {
        router.push("/me");
      }, 1200);
      }
      
    } catch (err: any) {
      setError(
        t('passwordChangeFailed')
      );
    } finally {
      setLoading(false);
    }
  };

  const isMinLength = new_password.length >= 9;
  const isNotNumeric = !/^\d+$/.test(new_password) || new_password.length === 0; // Allow empty string to avoid premature red

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="mb-4">
        <Link href="/me">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">{t('changePassword')}</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="current_password">{t('currentPassword')}</Label>
          <div className="relative">
            <Input
              id="current_password"
              type={showCurrentPassword ? "text" : "password"}
              value={current_password}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              tabIndex={-1}
            >
              {showCurrentPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <Label htmlFor="new_password">{t('newPassword')}</Label>
          <div className="relative">
            <Input
              id="new_password"
              type={showNewPassword ? "text" : "password"}
              value={new_password}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              tabIndex={-1}
            >
              {showNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          {new_password && (
            <div className="text-xs mt-1 space-y-1">
              <p className={isMinLength ? 'text-green-600' : 'text-red-500'}>
                • {t('passwordMinLength')}
              </p>
              <p className={isNotNumeric ? 'text-green-600' : 'text-red-500'}>
                • {t('passwordNotNumeric')}
              </p>
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="re_new_password">{t('confirmNewPassword')}</Label>
          <div className="relative">
            <Input
              id="re_new_password"
              type={showConfirmPassword ? "text" : "password"}
              value={re_new_password}
              onChange={e => setReNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              tabIndex={-1}
            >
              {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
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
