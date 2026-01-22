# 📊 Dashboard Logic - Detailed Line-by-Line Explanation

## Part 1: `calculateTrend()` Method (Backend)

**File:** `backend/services/dashboardService.ts` (Lines 13-24)

```typescript
private calculateTrend(current: number, previous: number): string {}
```

**Line 13:** 
- `private` - Only accessible within this class
- `calculateTrend` - Method name
- Parameters:
  - `current: number` - Current month's count (e.g., 15 appointments)
  - `previous: number` - Previous month's count (e.g., 12 appointments)
- Returns: `string` - Formatted percentage like "+25.00%" or "-20.00%"

---

```typescript
if (previous === 0) {
    return current > 0 ? "+100%" : "0%";
}
```

**Lines 15-17:** Edge Case Handling

**Scenario 1:** Previous month had 0 appointments
- **If current > 0:** Return "+100%" (meaning: went from 0 to something = 100% increase)
- **If current = 0:** Return "0%" (meaning: both months are 0 = no change)

**Why needed?** 
- Prevents division by zero error
- Handles edge case when business just started or had no activity

**Example:**
```
Previous month: 0 appointments
Current month: 5 appointments
Result: "+100%" (new activity started)
```

---

```typescript
const difference = current - previous;
```

**Line 19:** Calculate Raw Difference

**What it does:**
- Subtracts previous month from current month
- Result can be positive, negative, or zero

**Examples:**
```
current = 15, previous = 12 → difference = 3 (increase)
current = 8, previous = 12 → difference = -4 (decrease)
current = 12, previous = 12 → difference = 0 (no change)
```

---

```typescript
const percentage = (difference / previous) * 100;
```

**Line 20:** Calculate Percentage Change

**Formula:** `((Current - Previous) / Previous) × 100`

**Step-by-step:**
1. Divide difference by previous month (gives decimal ratio)
2. Multiply by 100 (converts to percentage)

**Examples:**

**Example 1: Increase**
```
current = 15, previous = 12
difference = 3
percentage = (3 / 12) × 100 = 0.25 × 100 = 25
```

**Example 2: Decrease**
```
current = 8, previous = 10
difference = -2
percentage = (-2 / 10) × 100 = -0.2 × 100 = -20
```

**Example 3: No Change**
```
current = 12, previous = 12
difference = 0
percentage = (0 / 12) × 100 = 0
```

---

```typescript
const rounded = percentage.toFixed(2);
```

**Line 21:** Round to 2 Decimal Places

**What it does:**
- Converts number to string with exactly 2 decimal places
- Always shows 2 decimals (even if .00)

**Examples:**
```
percentage = 25 → rounded = "25.00"
percentage = 25.333 → rounded = "25.33"
percentage = 25.999 → rounded = "26.00" (rounds up)
percentage = -20.5 → rounded = "-20.50"
```

**Why 2 decimals?** 
- Consistent formatting
- Professional appearance
- Easy to read

---

```typescript
return percentage >= 0 ? `+${rounded}%` : `${rounded}%`;
```

**Line 23:** Format Final Result

**Logic:**
- **If percentage >= 0** (positive or zero):
  - Add "+" sign: `+${rounded}%`
  - Example: `"+25.00%"`
- **If percentage < 0** (negative):
  - Already has "-" sign: `${rounded}%`
  - Example: `"-20.00%"`

**Why?**
- Positive trends show "+" for clarity
- Negative trends already have "-" from calculation
- Makes it clear if trend is up or down

**Final Examples:**
```
Input: current=15, previous=12
→ difference=3
→ percentage=25
→ rounded="25.00"
→ Result: "+25.00%"

Input: current=8, previous=10
→ difference=-2
→ percentage=-20
→ rounded="-20.00"
→ Result: "-20.00%" (already has minus)
```

---

## Part 2: `useDashboardStats()` Hook (Frontend)

**File:** `frontend/src/hooks/useDashboardStats.ts` (Lines 1-125)

---

### Section 1: Imports & Setup

```typescript
import { useMemo } from "react";
import { useGetDashboardStatsQuery } from "@/lib/store/services/dashboard/dashboardApi";
import type { AreaStatCardData, ChartPoint, RadialStatCardData } from "@/types";
```

**Line 1:** Import React's `useMemo` hook
- Used to memoize expensive calculations
- Prevents recalculation on every render

**Line 2:** Import RTK Query hook
- `useGetDashboardStatsQuery` - Fetches dashboard data from API
- Automatically handles loading, caching, refetching

**Line 3:** Import TypeScript types
- Type definitions for type safety
- No `any` types used

---

### Section 2: Hook Function Start

```typescript
export function useDashboardStats() {
    const { data, isLoading } = useGetDashboardStatsQuery();
```

**Line 5:** Hook function declaration
- Custom React hook (starts with "use")
- Returns dashboard stats for components

**Line 6:** Fetch data from API
- `data` - Response data from backend (or undefined if loading/error)
- `isLoading` - Boolean indicating if request is in progress
- **Single API call** - Optimized, no multiple requests

**What happens here:**
```
1. Hook calls useGetDashboardStatsQuery()
2. RTK Query makes GET request to /api/dashboard/stats
3. Backend returns all dashboard data in one response
4. data contains: consultations, patients, tasks
```

---

### Section 3: Area Stats Calculation (Lines 8-98)

```typescript
const areaStats: AreaStatCardData[] = useMemo(() => {
```

**Line 8:** Memoized calculation
- `useMemo` - Only recalculates when `data` changes
- Prevents unnecessary recalculations on every render
- Returns array of 2 items (Offline & Online consultation cards)

---

```typescript
if (!data?.data) {
    return [
        {
            title: "Offline Consultations",
            value: 0,
            deltaLabel: "0%",
            deltaType: "positive",
            chartData: [],
            ...
        },
        ...
    ];
}
```

**Lines 9-40:** Fallback Data (When No Data Available)

**When triggered:**
- Initial load (data is undefined)
- API error (data is undefined)
- Loading state (data is undefined)

**What it returns:**
- Empty state with zeros
- Prevents errors in components
- Shows placeholder until real data loads

**`data?.data` explanation:**
- `data` - RTK Query response wrapper
- `data.data` - Actual dashboard stats from backend
- `?.` - Optional chaining (safe if undefined)

**Structure:**
```
data = {
    status: "success",
    message: "...",
    data: {
        consultations: {...},
        patients: {...},
        tasks: {...}
    }
}
```

---

```typescript
const { consultations } = data.data;
```

**Line 42:** Extract Consultations Data

**What it does:**
- Destructures `consultations` from `data.data`
- Contains `offline` and `online` consultation stats

**Structure:**
```
consultations = {
    offline: {
        count: 101,
        trend: "+25.00%",
        chartData: [{ month: "January", value: 10 }, ...]
    },
    online: {
        count: 96,
        trend: "-20.00%",
        chartData: [...]
    }
}
```

---

```typescript
const offlineChartData: ChartPoint[] = consultations.offline.chartData.map(
    (point) => ({
        month: point.month,
        desktop: point.value,
    })
);
```

**Lines 44-49:** Transform Offline Chart Data

**What it does:**
- Maps backend format to frontend format
- Transforms each data point

**Transformation:**
```
Backend: { month: "January", value: 10 }
Frontend: { month: "January", desktop: 10 }
```

**Why?**
- Frontend chart component expects `desktop` property (not `value`)
- Chart library uses `desktop` as dataKey

**Step-by-step:**
1. `consultations.offline.chartData` - Array from backend
2. `.map()` - Transform each item
3. For each `point`:
   - Keep `month` as-is
   - Rename `value` → `desktop`
4. Result: Array of `ChartPoint` objects

**Example:**
```
Input: [
    { month: "January", value: 10 },
    { month: "February", value: 15 }
]

Output: [
    { month: "January", desktop: 10 },
    { month: "February", desktop: 15 }
]
```

---

```typescript
const onlineChartData: ChartPoint[] = consultations.online.chartData.map(
    (point) => ({
        month: point.month,
        desktop: point.value,
    })
);
```

**Lines 51-56:** Transform Online Chart Data

**Same logic as offline, but for online consultations**
- Same transformation: `value` → `desktop`
- Same reason: Frontend chart expects `desktop` property

---

```typescript
const offlineDeltaType: "positive" | "negative" =
    consultations.offline.trend.startsWith("+") || consultations.offline.trend === "0%"
        ? "positive"
        : "negative";
```

**Lines 58-61:** Determine Offline Trend Type

**What it does:**
- Converts trend string to type for UI styling
- Determines if trend is positive or negative

**Logic:**
```
IF trend starts with "+" OR trend equals "0%"
    THEN type = "positive"
ELSE
    type = "negative"
```

**Examples:**
```
trend = "+25.00%" → startsWith("+") → "positive" ✅
trend = "0%" → equals("0%") → "positive" ✅
trend = "-20.00%" → startsWith("-") → "negative" ✅
```

**Why needed?**
- Frontend needs to know if trend is positive/negative
- Used to style UI (green for positive, red for negative)
- Type-safe (no string comparison in components)

---

```typescript
const onlineDeltaType: "positive" | "negative" =
    consultations.online.trend.startsWith("+") || consultations.online.trend === "0%"
        ? "positive"
        : "negative";
```

**Lines 63-66:** Determine Online Trend Type

**Same logic as offline, but for online consultations**
- Same determination logic
- Same type safety

---

```typescript
return [
    {
        title: "Offline Consultations",
        value: consultations.offline.count,
        deltaLabel: consultations.offline.trend,
        deltaType: offlineDeltaType,
        chartData: offlineChartData,
        strokeColor: "#2F80ED",
        strokeWidth: 0.98,
        gradientId: "gradientOffline",
        gradientStops: [
            { offset: 0, color: "#2F80ED", opacity: 1 },
            { offset: 100, color: "rgba(217, 217, 217, 0)", opacity: 0 },
        ],
    },
    {
        title: "Online Consultations",
        value: consultations.online.count,
        deltaLabel: consultations.online.trend,
        deltaType: onlineDeltaType,
        chartData: onlineChartData,
        strokeColor: "#EB5757",
        strokeWidth: 0.87,
        gradientId: "gradientOnline",
        gradientStops: [
            { offset: 0, color: "#EB5757", opacity: 1 },
            { offset: 100, value: "rgba(226, 185, 59, 0)", opacity: 0 },
        ],
    },
];
```

**Lines 68-97:** Build Final Area Stats Array

**What it does:**
- Creates array of 2 objects (Offline & Online cards)
- Combines backend data with frontend styling

**Object 1: Offline Consultations**
- `title` - Static text
- `value` - Total count from backend (e.g., 101)
- `deltaLabel` - Trend string from backend (e.g., "+25.00%")
- `deltaType` - Calculated type ("positive" or "negative")
- `chartData` - Transformed chart data
- `strokeColor` - Blue color (#2F80ED)
- `strokeWidth` - Line thickness (0.98)
- `gradientId` - Unique ID for SVG gradient
- `gradientStops` - Gradient colors (blue to transparent)

**Object 2: Online Consultations**
- Same structure, but:
- `strokeColor` - Red color (#EB5757)
- `strokeWidth` - Slightly thinner (0.87)
- `gradientId` - Different ID ("gradientOnline")
- `gradientStops` - Red gradient

**Why these values?**
- Colors match design system
- Gradient IDs must be unique (SVG requirement)
- Stroke widths are design specifications

---

```typescript
}, [data]);
```

**Line 98:** Memoization Dependency

**What it does:**
- `[data]` - Dependency array
- Only recalculates when `data` changes
- If `data` unchanged, returns cached result

**Why important:**
- Prevents unnecessary recalculations
- Improves performance
- Prevents unnecessary re-renders

---

### Section 4: Radial Stats Calculation (Lines 100-116)

```typescript
const radialStat: RadialStatCardData = useMemo(() => {
```

**Line 100:** Memoized Radial Stats Calculation

**What it does:**
- Calculates patient statistics for radial chart
- Memoized for performance

---

```typescript
if (!data?.data) {
    return {
        title: "Total Patients",
        total: 0,
        female: 0,
        male: 0,
    };
}
```

**Lines 101-108:** Fallback Data

**When triggered:**
- No data available (loading/error state)

**Returns:**
- Empty state with zeros
- Prevents component errors

---

```typescript
return {
    title: "Total Patients",
    total: data.data.patients.total,
    female: data.data.patients.female,
    male: data.data.patients.male,
};
```

**Lines 110-115:** Extract Patient Stats

**What it does:**
- Extracts patient statistics from backend response
- Maps directly (no transformation needed)

**Backend Structure:**
```
data.data.patients = {
    total: 197,
    male: 87,
    female: 110
}
```

**Frontend Structure:**
```
{
    title: "Total Patients",
    total: 197,
    male: 87,
    female: 110
}
```

**Why direct mapping?**
- Backend structure matches frontend needs
- No transformation needed
- Simple extraction

---

```typescript
}, [data]);
```

**Line 116:** Memoization Dependency

**Same as line 98:**
- Only recalculates when `data` changes
- Performance optimization

---

### Section 5: Return Statement (Lines 118-122)

```typescript
return {
    areaStats,
    radialStat,
    isLoading,
};
```

**Lines 118-122:** Return Hook Values

**What it returns:**
- `areaStats` - Array of 2 consultation cards (Offline & Online)
- `radialStat` - Patient statistics for radial chart
- `isLoading` - Loading state boolean

**Usage in Components:**
```typescript
const { areaStats, radialStat, isLoading } = useDashboardStats();

// Use in JSX:
{areaStats.map(stat => <AreaStatCard {...stat} />)}
<RadialStatCard {...radialStat} />
```

---

## 🔄 Complete Data Flow

### Step-by-Step Flow:

```
1. Component calls useDashboardStats()
   ↓
2. Hook calls useGetDashboardStatsQuery()
   ↓
3. RTK Query makes GET /api/dashboard/stats
   ↓
4. Backend calculates all stats in parallel
   ↓
5. Backend returns complete data:
   {
     consultations: {
       offline: { count, trend, chartData },
       online: { count, trend, chartData }
     },
     patients: { total, male, female },
     tasks: { total, completed, pending, recent }
   }
   ↓
6. Frontend receives data
   ↓
7. useMemo transforms data:
   - Transforms chartData (value → desktop)
   - Determines deltaType (positive/negative)
   - Combines with styling config
   ↓
8. Returns transformed data to component
   ↓
9. Component renders cards with real data
```

---

## 🎯 Key Concepts Explained

### 1. **Memoization (`useMemo`)**

**Why used:**
- Prevents expensive recalculations
- Only recalculates when dependencies change
- Improves performance

**Example:**
```
Without useMemo:
- Component re-renders → Recalculates everything
- 100 re-renders = 100 recalculations ❌

With useMemo:
- Component re-renders → Uses cached result
- 100 re-renders = 1 calculation (if data unchanged) ✅
```

### 2. **Data Transformation**

**Why needed:**
- Backend uses `value` property
- Frontend chart expects `desktop` property
- Need to transform to match component expectations

**Transformation Chain:**
```
Backend: { month: "January", value: 10 }
    ↓ (map transformation)
Frontend: { month: "January", desktop: 10 }
    ↓ (used in chart)
Chart displays correctly ✅
```

### 3. **Type Safety**

**Why important:**
- Prevents runtime errors
- Catches errors at compile time
- Better IDE autocomplete
- Self-documenting code

**Example:**
```typescript
const offlineDeltaType: "positive" | "negative" = ...
// TypeScript ensures only these 2 values allowed
// Prevents typos or invalid values
```

### 4. **Fallback Handling**

**Why needed:**
- Handles loading state gracefully
- Prevents component crashes
- Better user experience

**Flow:**
```
Loading → Show zeros/empty → Real data loads → Update display
```

---

## 📊 Real-World Example

### Scenario:
- Backend returns:
  ```json
  {
    "consultations": {
      "offline": {
        "count": 101,
        "trend": "+25.00%",
        "chartData": [
          { "month": "January", "value": 10 },
          { "month": "February", "value": 15 }
        ]
      }
    }
  }
  ```

### Frontend Processing:

**Step 1:** Extract data
```typescript
const { consultations } = data.data;
// consultations.offline.trend = "+25.00%"
// consultations.offline.chartData = [{ month: "January", value: 10 }, ...]
```

**Step 2:** Transform chart data
```typescript
offlineChartData = [
  { month: "January", desktop: 10 },
  { month: "February", desktop: 15 }
]
```

**Step 3:** Determine delta type
```typescript
offlineDeltaType = "+25.00%".startsWith("+") ? "positive" : "negative"
// Result: "positive"
```

**Step 4:** Build final object
```typescript
{
  title: "Offline Consultations",
  value: 101,
  deltaLabel: "+25.00%",
  deltaType: "positive",
  chartData: [
    { month: "January", desktop: 10 },
    { month: "February", desktop: 15 }
  ],
  strokeColor: "#2F80ED",
  ...
}
```

**Step 5:** Component receives and displays
```typescript
<AreaStatCard 
  title="Offline Consultations"
  value={101}
  deltaLabel="+25.00%"
  deltaType="positive"
  chartData={[...]}
/>
```

---

## ✅ Summary

### `calculateTrend()` Method:
1. Handles edge case (previous = 0)
2. Calculates difference (current - previous)
3. Calculates percentage ((difference / previous) × 100)
4. Rounds to 2 decimals
5. Formats with "+" for positive, "-" for negative

### `useDashboardStats()` Hook:
1. Fetches data from API (single request)
2. Handles loading/empty states
3. Transforms chart data (value → desktop)
4. Determines trend types (positive/negative)
5. Combines backend data with frontend styling
6. Returns memoized results for performance

**Key Benefits:**
- ✅ Single API request (optimized)
- ✅ Memoized calculations (performance)
- ✅ Type-safe throughout (no `any`)
- ✅ Handles edge cases gracefully
- ✅ Clean separation of concerns
