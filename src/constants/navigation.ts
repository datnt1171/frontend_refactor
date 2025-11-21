import { 
  Factory,
  BarChart3,
  ListCheck,
  UserSearch,
  Car,
  Warehouse
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
    href: '/task-management', 
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
  { nameKey: 'navBar.externalApps.Fleet', 
    href: '/fleet', 
    icon: Car,  
    appKey: 'fleet',
    appTitle: 'fleet.appTitle',
    appDescription: 'fleet.appDescription', 
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
      title: "crm.sideBar.crm",
      icon: Factory,
      items: [
        { title: "crm.sideBar.factories", url: "/crm/factories" },
        { title: "crm.sideBar.retailers", url: "/crm/retailers" }
      ],
    },
  ],
  'user': [
    {
      title: "user.sideBar.HRM",
      icon: UserSearch,
      items: [
        { title: "user.sideBar.users", url: "/user" },
        { title: "user.sideBar.onsite", url: "/user/onsite" },
      ],
    }
  ],
  'fleet': [
    {
      title: "fleet.sideBar.car",
      icon: Car,
      items: [
        { title: "fleet.sideBar.log", url: "/fleet/trips" },
        { title: "fleet.sideBar.tripLog", url: "/fleet/trip-logs" },
      ],
    },
  ],
  'dashboard': [
    {
      title: "dashboard.sideBar.Task",
      icon: ListCheck,
      items: [
        { title: "dashboard.sideBar.taskAction", url: "/dashboard/task-management/action-detail" },
        { title: "dashboard.sideBar.sample", url: "/dashboard/task-management/data-detail" },
        { title: "dashboard.sideBar.onsiteTechnician", url: "/dashboard/task-management/onsite-transfer-absence" },
        { title: "dashboard.sideBar.KTWWork", url: "/dashboard/task-management/ktw-work" },
        { title: "dashboard.sideBar.KTWOT", url: "/dashboard/task-management/ktw-ot" },
        { title: "dashboard.sideBar.KVNWORK", url: "/dashboard/task-management/kvn-work" },
        { title: "dashboard.sideBar.transferAbsence", url: "/dashboard/task-management/transfer-absence" },
        { title: "dashboard.sideBar.overtime", url: "/dashboard/task-management/overtime" },
        { title: "dashboard.sideBar.dailyMovement", url: "/dashboard/task-management/daily-movement" },
      ],
    },
    {
      title: "dashboard.sideBar.Warehouse",
      icon: Warehouse,
      items: [
        { title: "dashboard.sideBar.overview", url: "/dashboard/warehouse/overall" },
        { title: "dashboard.sideBar.factorySalesRangeDiff", url: "/dashboard/warehouse/factory-sales-range-diff" },
        { title: "dashboard.sideBar.factoryOrderRangeDiff", url: "/dashboard/warehouse/factory-order-range-diff" },
        { title: "dashboard.sideBar.productRangeDiff", url: "/dashboard/warehouse/product" },
        { title: "dashboard.sideBar.scheduled", url: "/dashboard/warehouse/scheduled" },
        { title: "dashboard.sideBar.compare", url: "/dashboard/warehouse/overtime" },
        { title: "dashboard.sideBar.conclusion", url: "/dashboard/warehouse/conclusion" },
        { title: "dashboard.sideBar.pendingDelivery", url: "/dashboard/warehouse/pending-delivery" },
        { title: "dashboard.sideBar.ratio", url: "/dashboard/warehouse/ratio" },
        { title: "dashboard.sideBar.productBOM", url: "/dashboard/warehouse/product-bom" },
        { title: "dashboard.sideBar.agingProduct", url: "/dashboard/warehouse/aging" },
        { title: "dashboard.sideBar.importData", url: "/dashboard/warehouse/data" },

      ],
    },
  ]
}

// Function to determine current app from pathname
export function getCurrentApp(pathname: string): AppType {
  if (pathname.startsWith('/task-management')) return 'task-management'
  if (pathname.startsWith('/crm')) return 'crm'
  if (pathname.startsWith('/user')) return 'user'
  if (pathname.startsWith('/fleet')) return 'fleet'
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