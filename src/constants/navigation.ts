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
  { href: "/task-management/dashboard", labelKey: "taskManagement.sideBar.dashboard", icon: LayoutDashboard },
  { href: "/task-management/processes", labelKey: "taskManagement.sideBar.formTemplates", icon: FileText },
  { href: "/task-management/tasks/sent", labelKey: "taskManagement.sideBar.sentTasks", icon: Send },
  { href: "/task-management/tasks/received", labelKey: "taskManagement.sideBar.receivedTasks", icon: Inbox },
]

// Language options
export const languages = [
  { code: 'en', nameKey: 'navBar.languages.english', flag: '🇺🇸' },
  { code: 'vi', nameKey: 'navBar.languages.vietnamese', flag: '🇻🇳' },
  { code: 'zh-hant', nameKey: 'navBar.languages.chineseTraditional', flag: '🇨🇳' }
]

// External apps with translation keys
export const externalApps = [
  { nameKey: 'navBar.externalApps.Task', href: '/task-management/dashboard', icon: ListCheck, descriptionKey: 'navBar.externalApps.Task' },
  { nameKey: 'navBar.externalApps.CRM', href: '/crm', icon: Factory, descriptionKey: 'navBar.externalApps.CRM' },
  { nameKey: 'navBar.externalApps.HRM', href: '/user', icon: UserSearch, descriptionKey: 'navBar.externalApps.HRM' },
  { nameKey: 'navBar.externalApps.Dashboard', href: '/dashboard', icon: BarChart3, descriptionKey: 'navBar.externalApps.Dashboard' }
]

export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', 
                      '.pdf', '.doc', '.docx', 
                      '.xls', '.xlsx', 
                      '.heic', '.heif','.tiff', '.tif']

export const ACCEPTED_FILE_TYPES = ALLOWED_EXTENSIONS.join(',');