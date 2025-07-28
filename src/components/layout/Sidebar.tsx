'use client'
import * as React from "react"
import { ChevronRight } from "lucide-react"
import { appNavConfigs, getCurrentApp, getAppInfo } from "@/constants/navigation"
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


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations()
  const pathname = usePathname()
  const currentApp = getCurrentApp(pathname)
  const currentAppInfo = getAppInfo(currentApp)
  const data = {
    navMain: appNavConfigs[currentApp] || appNavConfigs['task-management'],
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {currentAppInfo && <currentAppInfo.icon className="size-4" />}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {t(currentAppInfo.appTitle)}
            </span>
            <span className="truncate text-xs">
              {t(currentAppInfo.appDescription)}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* Collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
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