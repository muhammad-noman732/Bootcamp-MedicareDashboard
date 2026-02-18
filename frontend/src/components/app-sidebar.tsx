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
} from "@/components/ui/sidebar"


const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    image: "/dashboard.svg",
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
      <SidebarHeader className="h-[92.18px] w-full flex flex-row items-center pt-[23px] pb-[22px] pl-[16px] gap-[16px] border-b border-r-[0.98px] border-sidebar-border shadow-none bg-white">
        <img
          src="/logo.png"
          alt="Medicare logo"
          className="h-full w-auto object-contain"
          style={{ opacity: 1 }}
        />
        <span className="text-[37.26px] font-normal text-primary leading-[100%] tracking-[0.0025em] font-mukta">
          Medicare
        </span>
      </SidebarHeader>

      <SidebarContent className="pr-3">
        { }
        <SidebarGroup className="mt-3">
          <SidebarGroupLabel
            style={{
              width: '34px',
              height: '21px',
              opacity: 1,
              paddingLeft: '19.61px',
              fontFamily: 'Mukta',
              fontWeight: 400,
              fontSize: '12.75px',
              lineHeight: '100%',
              letterSpacing: '0.004em',
              color: 'var(--sidebar-inactive-color)',
            }}
            className="mb-2 mt-2"
          >
            MENU
          </SidebarGroupLabel>
          <SidebarMenu style={{ gap: '8.83px' }}>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  style={{
                    width: '211.82px',
                    height: '44.13px',
                    paddingLeft: '19px',
                    paddingRight: '13px',
                  }}
                  className="group relative data-[active=true]:bg-transparent data-[active=true]:text-primary hover:bg-accent"
                >
                  <NavLink to={item.url} className="relative" end={item.url === '/dashboard'}>
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-sm mr-[5px]" />
                        )}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="size-5"
                          style={{
                            filter: isActive
                              ? 'invert(12%) sepia(100%) saturate(5855%) hue-rotate(240deg) brightness(91%) contrast(118%)'
                              : 'grayscale(100%)',
                            opacity: isActive ? 1 : 0.6
                          }}
                        />
                        <span
                          style={{
                            fontFamily: 'Mukta',
                            fontWeight: isActive ? 500 : 400,
                            fontSize: '15.69px',
                            lineHeight: '100%',
                            letterSpacing: '0.0025em',
                            color: isActive ? 'var(--primary)' : 'var(--sidebar-inactive-color)',
                          }}
                        >
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

        <div
          style={{
            width: '168.6676px',
            height: '0px',
            borderTop: '0.98px solid #E0E0E0',
            opacity: 1,
            marginLeft: '38.24px',
            marginTop: '17px',
          }}
        />

        <SidebarGroup style={{ marginTop: '27px' }}>
          <SidebarGroupLabel
            style={{
              width: '50px',
              height: '21px',
              opacity: 1,
              paddingLeft: '19.61px',
              fontFamily: 'Mukta',
              fontWeight: 400,
              fontSize: '12.75px',
              lineHeight: '100%',
              letterSpacing: '0.004em',
              color: 'var(--sidebar-inactive-color)',
            }}
            className="mb-2"
          >
            GENERAL
          </SidebarGroupLabel>
          <SidebarMenu style={{ gap: '8.83px' }}>
            {generalItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  style={{
                    width: '211.82px',
                    height: '44.13px',
                    paddingLeft: '19px',
                    paddingRight: '13px',
                  }}
                  className="group relative data-[active=true]:bg-transparent data-[active=true]:text-primary hover:bg-accent"
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
                          className="size-5"
                          style={{
                            filter: isActive
                              ? 'invert(12%) sepia(100%) saturate(5855%) hue-rotate(240deg) brightness(91%) contrast(118%)'
                              : 'grayscale(100%)',
                            opacity: isActive ? 1 : 0.6
                          }}
                        />
                        <span
                          style={{
                            fontFamily: 'Mukta',
                            fontWeight: isActive ? 500 : 400,
                            fontSize: '15.69px',
                            lineHeight: '100%',
                            letterSpacing: '0.0025em',
                            color: isActive ? 'var(--primary)' : 'var(--sidebar-inactive-color)',
                          }}
                        >
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