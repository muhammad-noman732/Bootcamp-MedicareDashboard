# 📋 Task Management API - Complete Documentation

## 🎯 **Purpose & Why We Need This**

Based on your Medicare Dashboard UI and workflow requirements:

### **Business Requirements:**
1. **Daily Task Management** - Doctors need to track administrative tasks (meetings, reports, patient follow-ups)
2. **Task Organization** - Separate completed from pending tasks for better workflow management
3. **Priority Tracking** - Mark urgent tasks with status flags (as shown in your UI)
4. **Date-based Planning** - Schedule tasks for specific dates
5. **Productivity Insights** - Track completion rates and task history

### **Technical Benefits:**
- **User Isolation** - Each doctor sees only their own tasks
- **Authorization** - Users can only modify tasks they created
- **Status Management** - Easy toggle between completed/pending
- **Flexible Updates** - Modify any aspect of a task
- **RESTful Design** - Clean API following HTTP best practices

---

## 📁 **Architecture Overview**

Following the same clean architecture pattern as Patient and Appointment modules:

```
Schema (Validation) → Controller (HTTP) → Service (Business Logic) → Repository (Database)
```

### **Files Created:**
1. `schema/taskSchema.ts` - Zod validation schemas ✅
2. `types/taskTypes.ts` - TypeScript type definitions ✅
3. `repositories/taskRepository.ts` - Database operations ✅
4. `services/taskService.ts` - Business logic ✅
5. `controllers/taskController.ts` - HTTP handlers ✅
6. `routes/taskRoutes.ts` - API routing ✅

---

## 🔍 **Code Explanation**

### **1. Schema Layer (`taskSchema.ts`)**

```typescript
export const createTaskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    status: z.boolean().optional(),
    statusText: z.string().optional(),
});
```

**Why:**
- **Validation** - Ensures data integrity before hitting the database
- **Type Safety** - TypeScript types auto-generated from schema
- **Error Messages** - User-friendly validation feedback
- **Optional Fields** - Flexibility for quick task creation

**Special Schemas:**
- `toggleTaskCompletionSchema` - Dedicated schema for completion status (cleaner than full update)
- `taskIdSchema` - Validates MongoDB ObjectId format

---

### **2. Types Layer (`taskTypes.ts`)**

```typescript
export type CreateTaskData = Pick<
    Task,
    'userId' | 'title' | 'description' | 'date' | 'status' | 'statusText'
>;
```

**Why:**
- **Pick from Prisma** - No type duplication; single source of truth
- **Type Safety** - Compile-time errors if database schema changes
- **Maintainability** - Changes to Prisma schema auto-propagate

---

### **3. Repository Layer (`taskRepository.ts`)**

```typescript
async findPendingTasks(userId: string): Promise<Task[]> {
    return await prisma.task.findMany({
        where: {
            userId,
            isCompleted: false,
        },
        orderBy: { date: "asc" },
    });
}
```

**Why These Methods:**
- `create` - Standard CRUD
- `findByUserId` - Get all tasks for a user
- `toggleCompletion` - **Optimized** for checkbox interaction
- `findCompletedTasks` - **Filtered view** for completed section
- `findPendingTasks` - **Filtered view** for to-do list (ordered by date)

**Ordering Logic:**
- Pending tasks: By `date ASC` (earliest first) - so doctors see urgent tasks first
- Completed tasks: By `updatedAt DESC` (most recent first) - latest completions on top
- All tasks: By `createdAt DESC` (newest first) - general chronological view

---

### **4. Service Layer (`taskService.ts`)**

```typescript
async createTask(userId: string, data: CreateTaskSchema): Promise<Task> {
    const createData = {
        userId,
        title: data.title,
        description: data.description ?? null,
        date: data.date ?? null,
        status: data.status ?? null,
        statusText: data.statusText ?? null,
    };

    return await this.taskRepository.create(createData);
}
```

**Why This Pattern:**
- **Null Handling** - Converts undefined → null for MongoDB compatibility
- **User Attachment** - Automatically associates task with authenticated user
- **Authorization Checks** - Prevents users from modifying others' tasks

**Business Rules Enforced:**
1. ✅ Users can only update/delete their own tasks
2. ✅ Task ID must exist before operations
3. ✅ Proper error types (NotFoundError vs UnauthorizedError)

---

### **5. Controller Layer (`taskController.ts`)**

```typescript
toggleTaskCompletion = asyncHandler(async (req: Request, res: Response) => {
    const { id } = taskIdSchema.parse(req.params);
    const userId = req.user.id;
    const { isCompleted } = toggleTaskCompletionSchema.parse(req.body);

    const updatedTask = await this.taskService.toggleTaskCompletion(id, userId, isCompleted);

    res.status(200).json({
        status: "success",
        message: `Task marked as ${isCompleted ? 'completed' : 'pending'}`,
        data: updatedTask
    });
});
```

**Why Separate Toggle Endpoint:**
- **Performance** - No need to send full task data for checkbox click
- **Clarity** - Explicit intent (completing vs editing)
- **UX** - Faster response for common action
- **Semantic** - PATCH method indicates partial update

---

### **6. Routes Layer (`taskRoutes.ts`)**

**Route Order Matters:**
```typescript
taskRouter.get('/completed', ...)  // ← Must be BEFORE /:id
taskRouter.get('/pending', ...)    // ← Must be BEFORE /:id
taskRouter.get('/:id', ...)        // ← Catch-all pattern
```

**Why:**
- Express matches routes in order
- `/completed` would match `/:id` pattern if placed after
- Specific routes before parameterized routes

**HTTP Methods:**
- `POST` - Create (new resource)
- `GET` - Read (no side effects)
- `PUT` - Full update (all fields)
- `PATCH` - Partial update (completion status)
- `DELETE` - Remove

---

## 📡 **API Endpoints**

### **Base URL:** `http://localhost:3000/api/tasks`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create task | ✅ Yes |
| GET | `/` | Get all user tasks | ✅ Yes |
| GET | `/completed` | Get completed tasks | ✅ Yes |
| GET | `/pending` | Get pending tasks | ✅ Yes |
| GET | `/:id` | Get task by ID | ✅ Yes |
| PUT | `/:id` | Update task | ✅ Yes |
| PATCH | `/:id/toggle` | Toggle completion | ✅ Yes |
| DELETE | `/:id` | Delete task | ✅ Yes |

---

## 🧪 **Postman Testing Examples**

### **1. Create Task**

```http
POST http://localhost:3000/api/tasks
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Set up afternoon meeting",
  "description": "Set up a virtual meeting for all consultants by afternoon. Link must be communicated to everyone before 1pm.",
  "date": "2026-01-14",
  "status": true,
  "statusText": "Urgent"
}
```

**Response - 201 Created:**
```json
{
  "status": "success",
  "message": "Task created successfully",
  "data": {
    "id": "6967b8c47fe64717a0b2cf60",
    "userId": "69676bda7fe64717a0b2ceff",
    "title": "Set up afternoon meeting",
    "description": "Set up a virtual meeting for all consultants by afternoon...",
    "date": "2026-01-14T00:00:00.000Z",
    "isCompleted": false,
    "status": true,
    "statusText": "Urgent",
    "createdAt": "2026-01-14T12:00:00.000Z",
    "updatedAt": "2026-01-14T12:00:00.000Z"
  }
}
```

---

### **2. Get All Tasks**

```http
GET http://localhost:3000/api/tasks?page=1&limit=10
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response - 200 OK:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "6967b8c47fe64717a0b2cf60",
      "title": "Set up afternoon meeting",
      "isCompleted": false,
      "date": "2026-01-14T00:00:00.000Z"
    }
  ],
  "pagination": {
    "totalRecords": 1,
    "currentPage": 1,
    "totalPages": 1,
    "nextPage": null,
    "prevPage": null
  },
  "stats": {
    "all": 5,
    "completed": 2,
    "pending": 3
  }
}
```

**Understanding the Stats:**
- `pagination.totalRecords`: Number of tasks matching your current filter (e.g., if you filtered by pending, this is 3).
- `stats.all`: Total tasks (5) - Use for "All" tab badge.
- `stats.completed`: Total completed tasks (2) - Use for "Completed" tab badge.
- `stats.pending`: Total pending tasks (3) - Use for "Pending" tab badge.

---

### **3. Get Pending Tasks Only**

```http
GET http://localhost:3000/api/tasks/pending
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Use Case:** Display in "To be completed" section of your UI

**Response - 200 OK:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "6967b8c47fe64717a0b2cf60",
      "title": "Set up afternoon meeting",
      "isCompleted": false,
      "date": "2026-01-14T00:00:00.000Z",
      "statusText": "Urgent"
    }
  ],
  "count": 1
}
```

---

### **4. Get Completed Tasks Only**

```http
GET http://localhost:3000/api/tasks/completed
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Use Case:** Display in "Tasks" completed section of your UI

**Response - 200 OK:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "6967b8c47fe64717a0b2cf61",
      "title": "Fill up the previous ERP Report",
      "isCompleted": true,
      "date": "2026-01-13T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### **5. Toggle Task Completion (Checkbox Click)**

```http
PATCH http://localhost:3000/api/tasks/6967b8c47fe64717a0b2cf60/toggle
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "isCompleted": true
}
```

**Response - 200 OK:**
```json
{
  "status": "success",
  "message": "Task marked as completed",
  "data": {
    "id": "6967b8c47fe64717a0b2cf60",
    "isCompleted": true,
    "updatedAt": "2026-01-14T12:05:00.000Z"
  }
}
```

**To mark as pending:**
```json
{
  "isCompleted": false
}
```

---

### **6. Update Task**

```http
PUT http://localhost:3000/api/tasks/6967b8c47fe64717a0b2cf60
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Set up morning meeting (UPDATED)",
  "date": "2026-01-15",
  "statusText": "Normal"
}
```

**Response - 200 OK:**
```json
{
  "status": "success",
  "message": "Task updated successfully",
  "data": {
    "id": "6967b8c47fe64717a0b2cf60",
    "title": "Set up morning meeting (UPDATED)",
    "date": "2026-01-15T00:00:00.000Z",
    "statusText": "Normal",
    "updatedAt": "2026-01-14T12:10:00.000Z"
  }
}
```

---

### **7. Delete Task**

```http
DELETE http://localhost:3000/api/tasks/6967b8c47fe64717a0b2cf60
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response - 200 OK:**
```json
{
  "status": "success",
  "message": "Task deleted successfully"
}
```

---

## 🔐 **Authorization & Security**

### **What's Protected:**

1. ✅ **JWT Required** - All endpoints require authentication
2. ✅ **User Isolation** - Can only see/modify own tasks
3. ✅ **Ownership Checks** - Verified before update/delete
4. ✅ **Rate Limiting** - 100 requests per 15 minutes
5. ✅ **Input Validation** - Zod schemas prevent injection

### **Error Responses:**

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized to update this task"
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Task not found"
}
```

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Title must be at least 3 characters long"
}
```

---

## 🎨 **Frontend Integration Examples**

### **Display Pending Tasks:**
```javascript
// Fetch pending tasks for "To be completed" section
const response = await fetch('http://localhost:3000/api/tasks/pending', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
const { data, count } = await response.json();
```

### **Checkbox Toggle:**
```javascript
// When user clicks checkbox
const toggleTask = async (taskId, isCompleted) => {
  await fetch(`http://localhost:3000/api/tasks/${taskId}/toggle`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isCompleted })
  });
};
```

### **Create Quick Task:**
```javascript
const createTask = async (title, date) => {
  const response = await fetch('http://localhost:3000/api/tasks', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, date })
  });
  return response.json();
};
```

---

## 📊 **Database Schema Reference**

From `prisma/schema.prisma`:

```prisma
model Task {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  userId      String    @db.ObjectId
  title       String
  description String?
  date        DateTime?
  isCompleted Boolean   @default(false)
  status      Boolean?
  statusText  String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id])
}
```

**Field Explanations:**
- `status` (Boolean) - For UI flags (urgent/normal)
- `statusText` (String) - Display text like "Urgent", "Today"
- `isCompleted` - Main completion flag for filtering
- `date` - Optional due date for planning

---

## ✅ **Code Quality Standards Met**

1. ✅ **No Custom Types** - Uses Prisma-generated + Pick utility
2. ✅ **Zod Validation** - All inputs validated
3. ✅ **Error Handling** - Custom error classes
4. ✅ **Async/Await** - Modern async patterns
5. ✅ **Clean Architecture** - Separation of concerns
6. ✅ **RESTful** - Proper HTTP methods and status codes
7. ✅ **Type Safety** - Full TypeScript coverage
8. ✅ **No Comments** - Self-documenting code

---

## 🚀 **Testing Workflow**

1. **Authenticate** → Get access token
2. **Create Task** → POST with title and date
3. **List Pending** → GET /pending to see to-do list
4. **Toggle Complete** → PATCH /toggle when checkbox clicked
5. **List Completed** → GET /completed to see finished tasks
6. **Update Task** → PUT with changes
7. **Delete Task** → DELETE to remove

---

## 🎯 **Summary**

The Task module provides a complete, production-ready task management system for your Medicare Dashboard with:

- **8 endpoints** covering all CRUD + filtering operations
- **Clean architecture** following your project patterns
- **Type safety** using Prisma and Zod
- **Authorization** ensuring user data isolation
- **Performance** with optimized queries and toggle endpoint
- **Flexibility** supporting various task attributes

Perfect for managing daily medical administrative tasks! 🏥✨

---

Made with ❤️ for Medicare Dashboard
Last Updated: 2026-01-14
