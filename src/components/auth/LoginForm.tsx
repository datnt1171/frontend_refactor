"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { login } from "@/lib/api/client/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginFormClientProps {
  translations: {
    Login: string;
    username: string;
    password: string;
    usernamePlaceholder: string;
    passwordPlaceholder: string;
    loginButton: string;
    loggingIn: string;
    authError: string;
    footerText: string;
    noAuthInput: string;
  };
}

export function LoginFormClient({ translations }: LoginFormClientProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username.trim() || !password.trim()) {
      setError(translations.noAuthInput);
       return;
    }

    setIsLoading(true)

    try {
      const response = await login({ username: username.toUpperCase(), password })
      
      if (response.data.success) {
        if (response.data.requiresPasswordChange) {
          router.push("/me/change-password")
        } else {
          router.push("/task-management/processes")
        }
      } else {
        setError(response.data.error)
      }
    } catch (err: unknown) {
      console.error("Login error:", err)
      setError(translations.authError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.Login}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{translations.username}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={translations.usernamePlaceholder}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{translations.password}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={translations.passwordPlaceholder}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500" aria-live="polite">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {translations.loggingIn}
              </>
            ) : (
              translations.loginButton
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">{translations.footerText}</p>
      </CardFooter>
    </Card>
  )
}