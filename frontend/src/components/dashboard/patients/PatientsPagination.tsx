import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PatientsPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
}

export function PatientsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PatientsPaginationProps) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page)
    }
  }

  const renderPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, 2, 3)
      if (currentPage > 4) {
        pages.push("...")
      }
      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage)
      }
      if (currentPage < totalPages - 3) {
        pages.push("...")
      }
      pages.push(totalPages)
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
            ...
          </span>
        )
      }

      const pageNum = page as number
      const isActive = pageNum === currentPage

      return (
        <Button
          key={pageNum}
          variant={isActive ? "default" : "ghost"}
          size="sm"
          className={cn(
            "min-w-[32px] h-8",
            isActive && "bg-primary text-white hover:bg-primary"
          )}
          onClick={() => handlePageChange(pageNum)}
        >
          {pageNum}
        </Button>
      )
    })
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1"
      >
        <ChevronLeft size={16} />
        <span>Prev</span>
      </Button>
      <div className="flex items-center gap-1">{renderPageNumbers()}</div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </Button>
    </div>
  )
}

