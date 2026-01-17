# Dashboard Backend Requirements Analysis

## Current Frontend Dashboard Structure

The dashboard home page (`DashboardHome.tsx`) displays:

### 1. **Statistics Cards (Top Section)**
- ✅ **Offline Consultations** - Area chart with count
- ✅ **Online Consultations** - Area chart with count
- ✅ **Total Patients** - Radial chart with male/female breakdown

### 2. **Tasks Section (Bottom Section)**
- ✅ **Recent Tasks** - List of 4 tasks with completion status
- ✅ **"New Tasks" button** - To create new tasks
- ✅ **"View all" link** - To navigate to full task page

---

## What's Currently in Backend ✅

### Existing Controllers:
1. ✅ **TaskController** - Full CRUD with pagination
2. ✅ **PatientController** - Full CRUD with pagination
3. ✅ **AppointmentController** - Full CRUD with date range queries
4. ✅ **AuthController** - Authentication

### Existing Models:
1. ✅ **User** - Doctor/user accounts
2. ✅ **Patient** - Patient records with status
3. ✅ **Appointment** - Appointments with type (offline/online)
4. ✅ **Task** - Tasks with completion status

---

## What's MISSING in Backend ❌

### 📊 **Dashboard Statistics API**

The frontend expects aggregated statistics, but the backend doesn't have a dedicated **Dashboard/Statistics endpoint**.

#### Missing API: `GET /api/dashboard/stats`

**Should Return:**
```json
{
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "consultations": {
      "offline": {
        "count": 101,
        "trend": "+3.11%",
        "chartData": [
          { "month": "January", "value": 186 },
          { "month": "February", "value": 305 },
          ...
        ]
      },
      "online": {
        "count": 96,
        "trend": "-20.9%",
        "chartData": [...]
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
      "recentTasks": [
        {
          "id": "task_id",
          "title": "Task Title",
          "description": "Task description",
          "isCompleted": true,
          "statusText": "Task Completed successfully",
          "date": "2026-01-17T00:00:00.000Z"
        }
      ]
    }
  }
}
```

---

## Required Backend Implementation

### 🎯 **Priority 1: Dashboard Statistics Endpoint**

Create a new **DashboardController** with a stats endpoint.

#### Files to Create:

1. **`controllers/dashboardController.ts`**
   - `getStats()` - Get all dashboard statistics

2. **`services/dashboardService.ts`**
   - `getDashboardStats(userId)` - Aggregate all statistics

3. **`repositories/dashboardRepository.ts`** (if needed)
   - Or reuse existing repositories

4. **`types/dashboardTypes.ts`**
   - Type definitions for response

5. **`routes/dashboardRoutes.ts`**
   - Route: `GET /api/dashboard/stats`

---

## Detailed Implementation Plan

### 📁 **1. Dashboard Service Logic**

```typescript
async getDashboardStats(userId: string) {
  // Parallel execution for performance
  const [
    offlineAppointments,
    onlineAppointments,
    patientStats,
    taskStats,
    monthlyData
  ] = await Promise.all([
    // Count offline appointments
    this.appointmentRepository.count({ 
      userId, 
      isOnline: false 
    }),
    
    // Count online appointments
    this.appointmentRepository.count({ 
      userId, 
      isOnline: true 
    }),
    
    // Patient statistics (total, male, female)
    this.patientRepository.getGenderStats(userId),
    
    // Task statistics
    this.getTaskStats(userId),
    
    // Monthly appointment data for charts
    this.getMonthlyAppointmentData(userId)
  ]);

  return {
    consultations: {
      offline: {
        count: offlineAppointments,
        trend: "+3.11%", // Calculate from previous month
        chartData: monthlyData.offline
      },
      online: {
        count: onlineAppointments,
        trend: "-20.9%", // Calculate from previous month
        chartData: monthlyData.online
      }
    },
    patients: patientStats,
    tasks: taskStats
  };
}
```

### 📁 **2. Required Repository Methods**

#### In `PatientRepository`:
```typescript
async getGenderStats(userId: string) {
  const [total, male, female] = await Promise.all([
    prisma.patient.count({ 
      where: { userId, deletedAt: null } 
    }),
    prisma.patient.count({ 
      where: { userId, sex: 'male', deletedAt: null } 
    }),
    prisma.patient.count({ 
      where: { userId, sex: 'female', deletedAt: null } 
    })
  ]);

  return { total, male, female };
}
```

#### In `AppointmentRepository`:
```typescript
async getMonthlyAppointmentData(userId: string) {
  // Get appointments grouped by month
  // Calculate offline and online counts per month
  // Return last 6 months of data
}

async getTrendPercentage(userId: string, isOnline: boolean) {
  // Compare current month vs previous month
  // Return percentage change
}
```

#### In `TaskRepository`:
```typescript
async getRecentTasks(userId: string, limit: number = 4) {
  return await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}

async getTaskStats(userId: string) {
  const [total, completed, pending] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, isCompleted: true } }),
    prisma.task.count({ where: { userId, isCompleted: false } })
  ]);

  return { total, completed, pending };
}
```

---

## What Already Works ✅

### 1. **Tasks**
- ✅ Task CRUD operations
- ✅ Pagination
- ✅ Tab filtering (all, completed, pending)
- ✅ Search functionality
- **Missing:** Recent tasks endpoint (separate from paginated)

### 2. **Patients**
- ✅ Patient CRUD operations
- ✅ Pagination
- ✅ Gender tracking (male/female)
- **Missing:** Gender statistics aggregation

### 3. **Appointments**
- ✅ Appointment CRUD operations
- ✅ Date range queries
- ✅ Online/Offline tracking (`isOnline` field)
- **Missing:** 
  - Monthly aggregation for charts
  - Trend calculation
  - Offline vs Online statistics

---

## Implementation Checklist

### Phase 1: Core Statistics ⚡ **CRITICAL**
- [ ] Create `dashboardController.ts`
- [ ] Create `dashboardService.ts`
- [ ] Create `dashboardTypes.ts`
- [ ] Add `getGenderStats()` to `PatientRepository`
- [ ] Add `getTaskStats()` to `TaskRepository`
- [ ] Add `getRecentTasks()` to `TaskRepository`
- [ ] Add dashboard routes
- [ ] Test endpoint

### Phase 2: Advanced Statistics
- [ ] Add `getMonthlyAppointmentData()` to `AppointmentRepository`
- [ ] Implement trend calculation logic
- [ ] Add chart data generation
- [ ] Optimize with caching (if needed)

### Phase 3: Frontend Integration
- [ ] Update `useDashboardStats.ts` hook to fetch from API
- [ ] Update `useTasks.ts` hook to fetch recent tasks
- [ ] Handle loading states
- [ ] Add error handling

---

## Current vs Required State

| Feature | Current State | Required State |
|---------|---------------|----------------|
| **Task Statistics** | ✅ Available via `/api/tasks` | ✅ Ready (just need aggregation) |
| **Patient Statistics** | ✅ Patients exist | ❌ Need gender aggregation |
| **Appointment Stats** | ✅ Appointments exist | ❌ Need offline/online aggregation |
| **Monthly Charts** | ❌ Not implemented | ❌ Need month grouping logic |
| **Trends** | ❌ Not implemented | ❌ Need percentage calculation |
| **Dashboard Endpoint** | ❌ Missing | ❌ **CRITICAL - MUST CREATE** |

---

## API Endpoints Needed

### ✅ Existing (Working):
```
GET  /api/tasks?page=1&limit=10          - Paginated tasks
GET  /api/tasks?isCompleted=true         - Completed tasks
GET  /api/patients?page=1&limit=10       - Paginated patients
GET  /api/appointments                   - All appointments
POST /api/tasks                          - Create task
POST /api/patients                       - Create patient
POST /api/appointments                   - Create appointment
```

### ❌ Missing (Need to Create):
```
GET /api/dashboard/stats                 - ⚠️ CRITICAL - Main dashboard stats
GET /api/tasks/recent?limit=4            - Recent tasks (optional - can use existing)
GET /api/patients/stats                  - Gender statistics (optional - can be part of dashboard)
GET /api/appointments/stats              - Offline/Online stats (optional - can be part of dashboard)
```

---

## Recommendation: Single Dashboard Endpoint

Instead of creating multiple endpoints, create **ONE comprehensive dashboard endpoint**:

### `GET /api/dashboard/stats`

This single endpoint returns everything the dashboard needs:
- Consultation statistics (offline/online)
- Patient statistics (total, male, female)
- Task statistics (total, completed, pending, recent tasks)
- Chart data for the last 6 months

**Benefits:**
- ✅ Single API call = faster loading
- ✅ Optimized with `Promise.all()` for parallel queries
- ✅ Easier frontend integration
- ✅ Better performance
- ✅ Simpler caching strategy

---

## Summary

### What You Have:
✅ All data models (User, Patient, Appointment, Task)
✅ All CRUD operations
✅ Pagination for all resources
✅ Authentication

### What You Need:
❌ **Dashboard Statistics Endpoint** - **HIGHEST PRIORITY**
❌ Gender aggregation for patients
❌ Offline/Online aggregation for appointments
❌ Monthly chart data generation
❌ Trend percentage calculation
❌ Recent tasks query (limited to 4)

### Estimated Work:
- **Dashboard Service**: ~2-3 hours
- **Repository Additions**: ~1-2 hours
- **Controller & Routes**: ~1 hour
- **Type Definitions**: ~30 minutes
- **Testing**: ~1 hour

**Total: ~5-7 hours of development**

---

## Next Steps

1. **Create the Dashboard module** following the same patterns as Patient/Task modules
2. **Implement statistics aggregation** in repositories
3. **Add monthly data grouping** for charts
4. **Test the endpoint** with real data
5. **Update frontend hooks** to consume the API

Would you like me to implement this dashboard statistics API for you?
