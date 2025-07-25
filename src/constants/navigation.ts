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

// Language options
export const languages = [
  { code: 'en', nameKey: 'navBar.languages.english', flag: '🇺🇸' },
  { code: 'vi', nameKey: 'navBar.languages.vietnamese', flag: '🇻🇳' },
  { code: 'zh-hant', nameKey: 'navBar.languages.chineseTraditional', flag: '🇨🇳' }
]

// External apps with translation keys
export const externalApps = [
  { nameKey: 'navBar.externalApps.Task', 
    href: '/task-management/dashboard', 
    icon: ListCheck, 
    appKey: 'task-management' ,
    appTitle: 'taskManagement.appTitle',
    appDescription: 'taskManagement.appDescription', 
  },
  { nameKey: 'navBar.externalApps.CRM', 
    href: '/crm', 
    icon: Factory, 
    appKey: 'crm',
    appTitle: 'crm.appTitle',
    appDescription: 'crm.appDescription', 
  },
  { nameKey: 'navBar.externalApps.HRM', 
    href: '/user', 
    icon: UserSearch,  
    appKey: 'user',
    appTitle: 'user.appTitle',
    appDescription: 'user.appDescription', 
  },
  { nameKey: 'navBar.externalApps.Dashboard', 
    href: '/dashboard', 
    icon: BarChart3, 
    appKey: 'dashboard',
    appTitle: 'dashboard.appTitle',
    appDescription: 'dashboard.appDescription', 
  }
] as const

// Define app types
export type AppType = typeof externalApps[number]['appKey']

// Navigation item type
export interface NavItem {
  title: string
  icon: any
  items: Array<{ 
    title: string
    url: string
  }>
}

export const appNavConfigs: Record<AppType, NavItem[]> = {
  'task-management': [
    {
      title: "taskManagement.sideBar.Task",
      icon: ListCheck,
      items: [
        { title: "taskManagement.sideBar.dashboard", url: "/task-management/dashboard" },
        { title: "taskManagement.sideBar.formTemplates", url: "/task-management/processes" },
        { title: "taskManagement.sideBar.sentTasks", url: "/task-management/tasks/sent" },
        { title: "taskManagement.sideBar.receivedTasks", url: "/task-management/tasks/received" },
      ],
    }
  ],
  'crm': [
    {
      title: "CRM",
      icon: Factory,
      items: [
        { title: "Dashboard", url: "/crm/dashboard" },
        { title: "Contacts", url: "/crm/factory" },
        { title: "Deals", url: "/crm/deals" },
        { title: "Companies", url: "/crm/companies" },
      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      items: [
        { title: "Sales Report", url: "/crm/reports/sales" },
        { title: "Pipeline", url: "/crm/reports/pipeline" },
      ],
    }
  ],
  'user': [
    {
      title: "HRM",
      icon: UserSearch,
      items: [
        { title: "Dashboard", url: "/user" },
        { title: "Employees", url: "/user/employees" },
        { title: "Departments", url: "/user/departments" },
        { title: "Attendance", url: "/user/attendance" },
      ],
    }
  ],
  'dashboard': [
    {
      title: "dashboard.sideBar.Warehouse",
      icon: BarChart3,
      items: [
        { title: "dashboard.sideBar.overview", url: "/dashboard/warehouse/overall" },
        { title: "dashboard.sideBar.perCustomer", url: "/dashboard/warehouse/customer" },
        { title: "dashboard.sideBar.perProduct", url: "/dashboard/warehouse/product" },
        { title: "dashboard.sideBar.plan", url: "/dashboard/warehouse/plan" },
        { title: "dashboard.sideBar.compare", url: "/dashboard/warehouse/compare" },
        { title: "dashboard.sideBar.conclusion", url: "/dashboard/warehouse/conclusion" },
        { title: "dashboard.sideBar.ratio", url: "/dashboard/warehouse/ratio" },
        { title: "dashboard.sideBar.agingProduct", url: "/dashboard/warehouse/aging" },
        { title: "dashboard.sideBar.importData", url: "/dashboard/warehouse/data" },

      ],
    },
    {
      title: "dashboard.sideBar.Task",
      icon: ListCheck,
      items: [
        { title: "dashboard.sideBar.sampleRequest", url: "/dashboard/task-management/sample-request" },
      ],
    }
  ]
}

// Function to determine current app from pathname
export function getCurrentApp(pathname: string): AppType {
  if (pathname.startsWith('/task-management')) return 'task-management'
  if (pathname.startsWith('/crm')) return 'crm'
  if (pathname.startsWith('/user')) return 'user'
  if (pathname.startsWith('/dashboard')) return 'dashboard'
  return 'task-management' // default
}

export function getAppInfo(appKey: AppType) {
  return externalApps.find(app => app.appKey === appKey) || externalApps[0]
}

export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', 
                      '.pdf', '.doc', '.docx', 
                      '.xls', '.xlsx', 
                      '.heic', '.heif','.tiff', '.tif']

export const ACCEPTED_FILE_TYPES = ALLOWED_EXTENSIONS.join(',');