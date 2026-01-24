import { Bell, LogOut, Mail, Search, Loader2 } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSearchParams } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { useGetCurrentUserQuery } from "@/lib/store/services/auth/authApi"
import { useLogout } from "@/hooks/useLogout"

export function TopBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")
  const debouncedSearch = useDebounce(searchValue, 400)

  // Move all hooks to the top
  const { data: userResponse } = useGetCurrentUserQuery()
  const { handleLogout, isLoading: isLoggingOut } = useLogout()

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date()).replace(/(\d+)\s/, '$1, ')
  }, [])

  const user = userResponse?.data

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams)
    if (debouncedSearch) {
      newParams.set("search", debouncedSearch)
    } else {
      newParams.delete("search")
    }

    if (newParams.get("search") !== searchParams.get("search")) {
      newParams.set("page", "1")
      setSearchParams(newParams, { replace: true })
    }
  }, [debouncedSearch, setSearchParams, searchParams])

  return (
    <header className="flex w-full items-center border-b border-[#E0E0E0] bg-white lg:h-20 h-16 px-0 sticky top-0 z-30">
      <div className="flex w-full items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-3 flex-1">
          <SidebarTrigger className="-ml-1 text-[#828282]" />
          <div className="relative w-full max-w-md hidden md:block">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search patients, tasks, or more..."
              className="h-10 w-full rounded-md border border-border px-4 pr-10 text-sm text-black placeholder:text-[#828282] focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#828282]"
            />
          </div>
          <button className="md:hidden p-2 text-[#828282]">
            <Search size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          <div className="hidden sm:block text-right leading-tight">
            <div className="text-sm font-medium text-black">
              {user?.name || user?.userName || "User"}
            </div>
            <div className="text-xs lg:text-sm font-semibold text-black">
              {user?.specialty || "Health Professional"}
            </div>
          </div>
          <div className="hidden lg:block rounded-md border border-border px-3 py-1.5 text-sm text-black whitespace-nowrap">
            {formattedDate}
          </div>
          <div className="flex items-center gap-3 lg:gap-4 text-[#828282]">
            <button className="relative p-1 hover:text-primary transition-colors">
              <Mail size={20} strokeWidth={1.5} />
              <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-destructive" />
            </button>
            <button className="relative p-1 hover:text-primary transition-colors">
              <Bell size={20} strokeWidth={1.5} />
              <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-destructive" />
            </button>
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


