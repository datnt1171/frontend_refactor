import { getTranslations } from 'next-intl/server';
import { LoginFormClient } from '@/components/auth/LoginForm';

export default async function LoginPage() {
  const t = await getTranslations('login');
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
        </div>
        <LoginFormClient
          translations={{
            Login: t('Login'),
            username: t('username'),
            password: t('password'),
            usernamePlaceholder: t('usernamePlaceholder'),
            passwordPlaceholder: t('passwordPlaceholder'),
            loginButton: t('loginButton'),
            loggingIn: t('loggingIn'),
            authError: t('authError'),
            footerText: t('footerText')
          }}
        />
      </div>
    </div>
  )
}
