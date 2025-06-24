import { 
  LayoutDashboard, 
  FileText, 
  Send, 
  Inbox,
  Table,
  Factory,
  BarChart3,
  ListCheck,
  UserSearch
} from "lucide-react"

// Navigation items with translation keys
export const navItems = [
  { href: "/task-management/dashboard", labelKey: "dashboard.navigation.dashboard", icon: LayoutDashboard },
  { href: "/task-management/processes", labelKey: "dashboard.navigation.formTemplates", icon: FileText },
  { href: "/task-management/tasks/sent", labelKey: "dashboard.navigation.sentTasks", icon: Send },
  { href: "/task-management/tasks/received", labelKey: "dashboard.navigation.receivedTasks", icon: Inbox },
  { href: "/task-management/reports/sample-request", labelKey: "dashboard.navigation.SPR", icon: Table },
]

// Language options
export const languages = [
  { code: 'en', nameKey: 'dashboard.languages.english', flag: '🇺🇸' },
  { code: 'vi', nameKey: 'dashboard.languages.vietnamese', flag: '🇻🇳' },
  { code: 'zh-hant', nameKey: 'dashboard.languages.chineseTraditional', flag: '🇨🇳' }
]

// External apps with translation keys
export const externalApps = [
  { nameKey: 'dashboard.externalApps.Task', href: '/task-management', icon: ListCheck },
  { nameKey: 'dashboard.externalApps.CRM', href: '/crm', icon: Factory },
  { nameKey: 'dashboard.externalApps.HRM', href: '/user', icon: UserSearch },
  { nameKey: 'dashboard.externalApps.Dashboard', href: '/dashboard', icon: BarChart3 }
]