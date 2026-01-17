# Task API - Quick Reference Guide

## Base URL
```
http://localhost:3000/api/tasks
```

---

## Endpoints Overview

### 1. Get Tasks (Paginated with Tabs)
**Endpoint:** `GET /api/tasks`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Current page number |
| limit | number | No | 10 | Items per page (max 100) |
| isCompleted | string | No | - | Filter: 'true' or 'false' |
| search | string | No | - | Search in title/description |

**Response Structure:**
```json
{
  "message": "Tasks retrieved successfully",
  "data": {
    "data": [
      {
        "id": "task_id",
        "userId": "user_id",
        "title": "Task Title",
        "description": "Task description",
        "date": "2026-01-20T00:00:00.000Z",
        "status": true,
        "statusText": "In Progress",
        "isCompleted": false,
        "createdAt": "2026-01-17T00:00:00.000Z",
        "updatedAt": "2026-01-17T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 50,
      "recordsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "stats": {
      "all": 113,
      "completed": 45,
      "pending": 68
    }
  }
}
```

---

## Usage Examples

### Example 1: Get All Tasks (First Page)
```bash
GET /api/tasks?page=1&limit=10
```

### Example 2: Get All Tasks (Second Page)
```bash
GET /api/tasks?page=2&limit=10
```

### Example 3: Get Completed Tasks
```bash
GET /api/tasks?page=1&limit=10&isCompleted=true
```

### Example 4: Get Pending Tasks
```bash
GET /api/tasks?page=1&limit=10&isCompleted=false
```

### Example 5: Search in All Tasks
```bash
GET /api/tasks?page=1&limit=10&search=appointment
```

### Example 6: Search in Completed Tasks
```bash
GET /api/tasks?page=1&limit=10&isCompleted=true&search=doctor
```

---

## Frontend Integration Examples

### React/TypeScript Example

```typescript
import { useState, useEffect } from 'react';

// Types
interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  date: string | null;
  status: boolean | null;
  statusText: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaskPagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface TaskStats {
  all: number;
  completed: number;
  pending: number;
}

interface TaskResponse {
  data: Task[];
  pagination: TaskPagination;
  stats: TaskStats;
}

// Component
function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<TaskPagination | null>(null);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [currentTab, setCurrentTab] = useState<'all' | 'completed' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = async () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: '10',
    });

    // Add filter based on tab
    if (currentTab === 'completed') {
      params.append('isCompleted', 'true');
    } else if (currentTab === 'pending') {
      params.append('isCompleted', 'false');
    }

    // Add search
    if (searchQuery) {
      params.append('search', searchQuery);
    }

    const response = await fetch(`/api/tasks?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const result = await response.json();
    
    setTasks(result.data.data);
    setPagination(result.data.pagination);
    setStats(result.data.stats);
  };

  useEffect(() => {
    fetchTasks();
  }, [currentTab, currentPage, searchQuery]);

  return (
    <div>
      {/* Tabs */}
      <div className="tabs">
        <button 
          onClick={() => setCurrentTab('all')}
          className={currentTab === 'all' ? 'active' : ''}
        >
          All ({stats?.all || 0})
        </button>
        <button 
          onClick={() => setCurrentTab('completed')}
          className={currentTab === 'completed' ? 'active' : ''}
        >
          Completed ({stats?.completed || 0})
        </button>
        <button 
          onClick={() => setCurrentTab('pending')}
          className={currentTab === 'pending' ? 'active' : ''}
        >
          Pending ({stats?.pending || 0})
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Task List */}
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <span>{task.isCompleted ? 'Completed' : 'Pending'}</span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="pagination">
          <button 
            disabled={!pagination.hasPrevPage}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button 
            disabled={!pagination.hasNextPage}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Tab Implementation Logic

### Tab States
1. **All Tab** (default)
   - No `isCompleted` filter
   - Shows all tasks
   - Sorted by `createdAt DESC`

2. **Completed Tab**
   - Filter: `isCompleted=true`
   - Shows only completed tasks
   - Sorted by `updatedAt DESC` (most recently completed first)

3. **Pending Tab**
   - Filter: `isCompleted=false`
   - Shows only pending tasks
   - Sorted by `date ASC` (soonest due date first)

### Important Notes
- **Stats remain global**: Even when filtering, stats show total counts
- **Pagination resets**: When switching tabs, reset to page 1
- **Search works across tabs**: Search query is applied to the current tab filter

---

## Other Task Endpoints

### 2. Create Task
```
POST /api/tasks
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "title": "Task Title",
  "description": "Task description",
  "date": "2026-01-20",
  "status": true,
  "statusText": "In Progress"
}
```

### 3. Get Single Task
```
GET /api/tasks/:id
Authorization: Bearer <token>
```

### 4. Update Task
```
PUT /api/tasks/:id
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "title": "Updated Title",
  "description": "Updated description",
  "isCompleted": true
}
```

### 5. Toggle Task Completion
```
PATCH /api/tasks/:id/toggle
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "isCompleted": true
}
```

### 6. Delete Task
```
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Unauthorized to get tasks"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Task not found"
}
```

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation error",
  "errors": [...]
}
```

---

## Best Practices

1. **Always include Authorization header** with Bearer token
2. **Reset page to 1** when changing tabs or search query
3. **Use stats for tab counts** to show accurate counts
4. **Handle loading states** during pagination
5. **Display empty states** when no tasks found
6. **Debounce search input** to reduce API calls
7. **Cache responses** if using React Query or SWR

---

## Testing with cURL

### Get All Tasks
```bash
curl -X GET "http://localhost:3000/api/tasks?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Completed Tasks
```bash
curl -X GET "http://localhost:3000/api/tasks?page=1&limit=10&isCompleted=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search Tasks
```bash
curl -X GET "http://localhost:3000/api/tasks?page=1&limit=10&search=doctor" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Status:** ✅ Production Ready
**Version:** 2.0
**Last Updated:** 2026-01-17
