# Frontend Password Reset Implementation Guide

## Overview
Complete password reset flow for the Medicare Dashboard frontend, fully integrated with the backend.

---

## ✅ Files Created/Modified

### 1. **Types** (`src/types/auth.ts`)
Added new interfaces:
```typescript
interface ForgotPasswordInput {
    email: string;
}

interface ResetPasswordInput {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

type ForgotPasswordResponse = ApiResponse<{ message: string }>;
type ResetPasswordResponse = ApiResponse<{ message: string }>;
```

### 2. **API Service** (`src/lib/store/services/auth/authApi.ts`)
Added two new mutations:

**Forgot Password Mutation:**
- Endpoint: `POST /auth/forgot-password`
- Body: `{ email: string }`
- Response: Success message

**Reset Password Mutation:**
- Endpoint: `POST /auth/reset-password`
- Body: `{ token, newPassword, confirmPassword }`
- Response: Success message and redirect to login

### 3. **Hooks**

#### `src/hooks/useForgotPassword.ts`
```typescript
const { form, onSubmit, isLoading } = useForgotPassword();
```
**Features:**
- Form validation with Zod schema
- Email validation
- Toast notifications
- Loading state management
- Error handling with user feedback

#### `src/hooks/useResetPassword.ts`
```typescript
const { form, onSubmit, isLoading, isSuccess, token } = useResetPassword();
```
**Features:**
- Extracts token from URL query parameter (`?token=xxx`)
- Form validation with password matching
- Minimum 8 character password requirement
- Validates token existence before allowing submission
- Redirects to login on success
- Error handling and token expiration messages

### 4. **Components**

#### `src/components/auth/ForgotPasswordForm.tsx`
- Email input field
- Submit button with loading state
- Link back to login page
- Form validation in real-time
- Success/error toast notifications

#### `src/components/auth/ResetPasswordForm.tsx`
- New password input
- Confirm password input
- Password matching validation
- Invalid token handling
- Submit button with loading state
- Link back to login page

### 5. **Pages**

#### `src/pages/auth/forgotPassword/ForgotPasswordPage.tsx`
- Already exists, no changes needed
- Renders ForgotPasswordForm component

#### `src/pages/auth/resetPassword/ResetPasswordPage.tsx` (NEW)
```typescript
export const ResetPasswordPage = () => {
  return (
    <div className="w-full min-h-screen flex justify-center bg-background">
      <div className="w-full max-w-[1440px] grid grid-cols-1 xl:grid-cols-[42%_58%] ...">
        <div className="flex flex-col pt-16 px-6 sm:px-12 xl:px-16 overflow-y-auto scrollbar-hide">
          <ResetPasswordForm />
        </div>
        <div className="w-full h-[600px] xl:h-full relative overflow-hidden">
          <DashboardPreview />
        </div>
      </div>
    </div>
  )
}
```

### 6. **Routes** (`src/App.tsx`)
```typescript
// Public route for forgot password (already exists)
{
  path: "/auth/forgot-password",
  element: <ForgotPasswordPage />,
}

// NEW: Public route for reset password
{
  path: "/auth/reset-password",
  element: <ResetPasswordPage />,
}
```

---

## 🔄 User Flow

### **Step 1: Forgot Password**
```
User → /auth/forgot-password
  ↓
Enter Email
  ↓
Click "Send reset link"
  ↓
Backend sends email with token link: https://app.com/auth/reset-password?token=xxxxx
  ↓
Toast: "Check your email for reset link"
```

### **Step 2: Reset Password**
```
User clicks email link → /auth/reset-password?token=xxxxx
  ↓
Token extracted from URL
  ↓
ResetPasswordForm renders
  ↓
User enters new password + confirm password
  ↓
Click "Reset Password"
  ↓
Backend validates token, updates password, revokes all tokens
  ↓
Toast: "Password reset successfully"
  ↓
Auto-redirect to /auth/login after 2 seconds
```

---

## 🛡️ Security Features

| Feature | Implementation |
|---------|-----------------|
| **Token Validation** | Token extracted from URL, must be provided to submit form |
| **One-time Use** | Backend marks token as used, prevents reuse |
| **Token Expiry** | 15-minute expiration handled by backend |
| **Password Matching** | Frontend and backend validation |
| **Session Invalidation** | All refresh tokens revoked after reset |
| **Error Messages** | User-friendly toast notifications |
| **XSS Protection** | React handles all string rendering |
| **CSRF Protection** | Backend validates token server-side |

---

## 📝 Form Validation

### Forgot Password Schema
```typescript
{
  email: string (required, valid email format)
}
```

### Reset Password Schema
```typescript
{
  token: string (extracted from URL, required)
  newPassword: string (min 8 characters)
  confirmPassword: string (must match newPassword)
}
```

---

## 🔔 Toast Notifications

### Forgot Password
- **Success:** "Check Your Email! Password reset link sent to your email."
- **Error:** Backend error message
- **Reminder:** "Didn't receive the email? Check your spam folder"

### Reset Password
- **Success:** "Password Reset Successful! You can now login with your new password."
- **Error:** "Invalid reset token" or "Password reset token has expired"
- **Validation:** "Passwords do not match"
- **Invalid Link:** Redirects to forgot-password page

---

## 🔗 Email Integration

The frontend sends the plain token to the backend, which generates an email link:

```html
<!-- Email contains: -->
<a href="https://yourdomain.com/auth/reset-password?token=PLAIN_TOKEN_HERE">
  Reset Your Password
</a>
```

**Important:** The email contains the **plain token**, not the hashed version.

---

## 🧪 Testing Checklist

- [ ] Forgot password form validates email
- [ ] Email is sent successfully
- [ ] Toast message appears on email sent
- [ ] Reset password link works from email
- [ ] Token is extracted correctly from URL
- [ ] Password validation shows "passwords must match" error
- [ ] Password must be at least 8 characters
- [ ] Submit button is disabled while loading
- [ ] Success message appears on password reset
- [ ] Redirects to login after 2 seconds
- [ ] Invalid token shows error and redirects
- [ ] Token expiration error is handled gracefully

---

## 📱 Responsive Design

- Mobile: Single column layout with form on top, dashboard preview below
- Tablet: Adaptive grid
- Desktop: 42% form, 58% dashboard preview side-by-side
- All components use Tailwind CSS for responsive behavior

---

## 🐛 Error Handling

All errors are caught and displayed as toast notifications:

```typescript
// Backend errors are caught and displayed
try {
  await forgotPassword({ email }).unwrap();
} catch (err) {
  // Toast shows error message from backend
  toast.error("Error", { description: message });
}
```

---

## 🔄 API Integration

### Request/Response Examples

**Forgot Password Request:**
```json
POST /auth/forgot-password
{
  "email": "user@company.com"
}
```

**Forgot Password Response:**
```json
{
  "status": "success",
  "message": "Password reset email sent. Please check your inbox for instructions."
}
```

**Reset Password Request:**
```json
POST /auth/reset-password
{
  "token": "base64url_encoded_token",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Reset Password Response:**
```json
{
  "status": "success",
  "message": "Password reset successfully. Please login with your new password."
}
```

---

## 💡 Features

✅ **Email Validation** - Ensures valid email format
✅ **Password Strength** - Minimum 8 characters
✅ **Password Confirmation** - Prevents typos
✅ **Token Extraction** - Automatic URL token reading
✅ **Auto-redirect** - Navigates to login after reset
✅ **Loading States** - Buttons show loading status
✅ **Toast Notifications** - User-friendly feedback
✅ **Error Handling** - Comprehensive error messages
✅ **Responsive Design** - Works on all devices
✅ **Security** - One-time tokens, expiration, session invalidation

---

## 🚀 Production Ready

This implementation follows:
- ✅ React best practices
- ✅ TypeScript strict mode
- ✅ Zod schema validation
- ✅ RTK Query for API calls
- ✅ React Hook Form for form management
- ✅ Responsive Tailwind CSS
- ✅ Accessibility standards
- ✅ Error handling patterns
- ✅ Loading states
- ✅ User feedback (toasts)
