import * as React from "react"
import { NavLink } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"


const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    image: "/vite.svg",
  },
  {
    title: "Schedule",
    url: "/dashboard/schedule",
    image: "/shedule.svg",
  },
  {
    title: "Tasks",
    url: "/dashboard/tasks",
    image: "/tasks.svg",
  },
  {
    title: "Patients",
    url: "/dashboard/patients",
    image: "/patient.svg",
  },
  {
    title: "Messages",
    url: "/dashboard/messages",
    image: "/message.png",
    badge: 2,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    image: "/analytics.svg",
  },
]

const generalItems = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    image: "/settings.svg",
  },
  {
    title: "Support",
    url: "/dashboard/support",
    image: "/support.svg",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader className="border-b border-sidebar-border lg:h-20 h-16 flex items-center px-4">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Medicare logo"
            className="h-8 w-8 lg:h-10 lg:w-10 rounded-full object-contain"
          />
          <span className="text-xl font-semibold text-[#0000AC]">Medicare</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="pr-3">
        {/* MENU Section */}
        <SidebarGroup className="mt-3">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2 px-2">
            MENU
          </SidebarGroupLabel>
          <SidebarMenu className="gap-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="group relative h-11 data-[active=true]:bg-transparent data-[active=true]:text-primary hover:bg-accent"
                >
                  <NavLink to={item.url} className="relative">
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute -left-0 top-0 h-full w-1 bg-primary rounded-r-sm mr-[5px]" />
                        )}
                        <img
                          src={item.image}
                          alt={item.title}
                          className={`size-5 ${isActive ? '' : 'opacity-60 grayscale'}`}
                        />
                        <span className={`${isActive ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="ml-10 bg-destructive text-white text-xs font-medium  rounded-full h-5 w-5 flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="mx-4 my-4" />

        {/* GENERAL Section */}
        <SidebarGroup className="mt-7">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2 px-2">
            GENERAL
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {generalItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="group relative h-11 data-[active=true]:bg-transparent data-[active=true]:text-primary hover:bg-accent"
                >
                  <NavLink to={item.url}>
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-sm mr-[5px]" />
                        )}
                        <img
                          src={item.image}
                          alt={item.title}
                          className={`size-5 ${isActive ? '' : 'opacity-60 grayscale'}`}
                        />
                        <span className={`${isActive ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                          {item.title}
                        </span>
                      </>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
