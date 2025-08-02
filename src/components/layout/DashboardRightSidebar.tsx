//src\components\layout\DashboardRightSidebar.tsx
'use client'
import * as React from "react"
import { ChevronRight, BarChart3, Settings, Bell } from "lucide-react"
import { usePathname } from "@/i18n/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"

// Sample dashboard navigation data
const dashboardNavData = [
  {
    title: "dashboard.analytics.title",
    icon: BarChart3,
    items: [
      { title: "dashboard.analytics.overview", url: "/dashboard/analytics/overview" },
      { title: "dashboard.analytics.reports", url: "/dashboard/analytics/reports" },
      { title: "dashboard.analytics.metrics", url: "/dashboard/analytics/metrics" },
    ],
  },
  {
    title: "dashboard.settings.title",
    icon: Settings,
    items: [
      { title: "dashboard.settings.general", url: "/dashboard/settings/general" },
      { title: "dashboard.settings.security", url: "/dashboard/settings/security" },
      { title: "dashboard.settings.integrations", url: "/dashboard/settings/integrations" },
    ],
  },
  {
    title: "dashboard.notifications.title", 
    icon: Bell,
    items: [
      { title: "dashboard.notifications.alerts", url: "/dashboard/notifications/alerts" },
      { title: "dashboard.notifications.preferences", url: "/dashboard/notifications/preferences" },
    ],
  },
]

export function DashboardRightSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations()
  const pathname = usePathname()

  return (
    <Sidebar side="right" collapsible="offcanvas" className="w-64" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <BarChart3 className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {t("dashboard.sidebar.title")}
            </span>
            <span className="truncate text-xs">
              {t("dashboard.sidebar.description")}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {dashboardNavData.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  <item.icon className="mr-2 h-4 w-4" />
                  {t(item.title)}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild isActive={pathname === subItem.url}>
                          <a href={subItem.url}>{t(subItem.title)}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}