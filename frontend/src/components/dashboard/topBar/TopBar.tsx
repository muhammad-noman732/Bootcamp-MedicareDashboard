import { LogOut, Mail, Search, Loader2 } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTopBar } from "@/hooks/useTopBar"
import { NotificationDropdown } from "./NotificationDropdown"

export function TopBar() {
  const {
    searchValue,
    setSearchValue,
    user,
    isLoggingOut,
    handleLogout,
    formattedDate
  } = useTopBar()

  return (
    <header className="flex w-full items-center border-b border-border bg-white lg:h-20 h-16 px-0 sticky top-0 z-30 font-mukta">
      <div className="flex w-full items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-3 flex-1">
          <SidebarTrigger className="-ml-1 text-gray-3" />
          <div className="relative w-full max-w-md hidden md:block">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search patients, tasks, or more..."
              className="h-10 w-full rounded-md border border-border px-4 pr-10 text-sm text-dark placeholder:text-gray-3 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mukta"
            />
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-3"
            />
          </div>
          <button className="md:hidden p-2 text-gray-3">
            <Search size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          <div className="hidden sm:block text-right leading-tight">
            <div className="text-sm font-medium text-dark font-mukta">
              {user?.name || user?.userName || "User"}
            </div>
            <div className="text-xs lg:text-sm font-semibold text-dark font-mukta">
              {user?.specialty || "Health Professional"}
            </div>
          </div>
          <div className="hidden lg:block rounded-md border border-border px-3 py-1.5 text-sm text-dark whitespace-nowrap font-mukta">
            {formattedDate}
          </div>
          <div className="flex items-center gap-3 lg:gap-4 text-gray-3">
            <button className="relative p-1 hover:text-primary transition-colors">
              <Mail size={20} strokeWidth={1.5} />
              <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-destructive" />
            </button>
            <NotificationDropdown />
            <button

              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-1 hover:text-destructive transition-colors disabled:opacity-50"
              title="Logout"
            >
              {isLoggingOut ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <LogOut size={20} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}


