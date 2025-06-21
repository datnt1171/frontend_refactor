import { redirect } from "@/i18n/navigation"

export default function Home() {
  // Redirect to login page
  redirect({ href: "/login", locale: 'vi' })

  // This won't be rendered, but we include it for completeness
  return null
}
