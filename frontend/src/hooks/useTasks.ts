import { useMemo } from "react"

import type { TasksCardData } from "@/types"

export function useTasks(): TasksCardData {
  const tasks = useMemo(
    () => [
      {
        id: "1",
        isCompleted: true,
        statusText: "Task Completed successfully",
        description: "Sign up for Covid - 19 training course for medicians",
        date: "24 Oct 2022",
      },
      {
        id: "2",
        isCompleted: true,
        statusText: "Task Completed successfully",
        description: "Fill up the previous ERP Report",
        date: "24 Oct 2022",
      },
      {
        id: "3",
        isCompleted: true,
        statusText: "Task Completed successfully",
        description: "Send prescription files to Night duty nurse",
        date: "24 Oct 2022",
      },
      {
        id: "4",
        isCompleted: false,
        statusText: "Task not completed",
        description: "Set up afternoon meeting",
        date: "24 Oct 2022",
      },
    ],
    []
  )

  return { tasks }
}

