import { Bell, LogOut, Mail, Search } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"

export function TopBar() {
  return (
    <header className="flex w-full items-center border-b border-[#E0E0E0] border-r-[0.98px] bg-white h-[92.17882110819937px] px-0">
      <div className="flex w-full items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1 text-[#828282]" />
          <div className="relative w-[580.5304647124285px] h-[40.205655122476855px]">
            <input
              placeholder="Search"
              className="h-full w-full rounded-[5.88px] border-[0.98px] border-border px-4 pr-10 text-sm text-black placeholder:text-[#828282]"
            />
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#828282]"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right leading-tight">
            <div className="text-sm font-medium text-black">John Doe</div>
            <div className="text-sm font-semibold text-black">General Doctor</div>
          </div>
          <div className="rounded-md border border-border px-3 py-2 text-sm text-black">
            24,October 2022
          </div>
          <div className="flex items-center gap-4 text-[#828282]">
            <div className="relative">
              <Mail size={22} strokeWidth={1.5} />
              <span className="absolute -right-1 top-0 block h-2 w-2 rounded-full bg-destructive" />
            </div>
            <div className="relative">
              <Bell size={22} strokeWidth={1.5} />
              <span className="absolute -right-1 top-0 block h-2 w-2 rounded-full bg-destructive" />
            </div>
            <LogOut size={22} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </header>
  )
}

