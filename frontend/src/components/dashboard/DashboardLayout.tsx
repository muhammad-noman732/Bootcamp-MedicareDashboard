import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/dashboard/topBar/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-muted/50">
        <TopBar />
        <div className="flex flex-1 flex-col bg-muted/50">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
