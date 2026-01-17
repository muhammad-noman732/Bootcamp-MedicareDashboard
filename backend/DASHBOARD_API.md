# 📊 Dashboard API Documentation

## Get Dashboard Statistics

Retrieves aggregated statistics for the dashboard, including consultation trends, patient demographics, and recent tasks.

**Endpoint:** `GET /api/dashboard/stats`
**Auth Required:** Yes (Bearer Token)

### Request

- **Headers:**
  - `Authorization`: `Bearer <jwt_token>`

### Response

```json
{
  "status": "success",
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "consultations": {
      "offline": {
        "count": 101,            // Total all-time count
        "currentMonthCount": 15, // Count for current month
        "previousMonthCount": 12,// Count for previous month
        "trend": "+25.00%",      // Percentage change
        "chartData": []          // (Placeholder for future charts)
      },
      "online": {
        "count": 96,
        "currentMonthCount": 8,
        "previousMonthCount": 10,
        "trend": "-20.00%",
        "chartData": []
      }
    },
    "patients": {
      "total": 197,
      "male": 87,
      "female": 110
    },
    "tasks": {
      "total": 15,
      "completed": 8,
      "pending": 7,
      "recent": [
        {
          "id": "task_id",
          "title": "Task Title",
          "description": "Task description",
          "isCompleted": true,
          "statusText": "Task Completed successfully",
          "date": "2026-01-17T00:00:00.000Z",
          "createdAt": "2026-01-17T00:00:00.000Z",
          "updatedAt": "2026-01-17T00:00:00.000Z"
        }
        // ... up to 4 recent tasks
      ]
    }
  }
}
```

### Integration Example (React)

```typescript
// hooks/useDashboardStats.ts

import { useState, useEffect } from 'react';
import { api } from '@/lib/api'; // Your axios instance

export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
```
