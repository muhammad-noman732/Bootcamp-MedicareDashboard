# 🔄 Password Reset Flow - Complete Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + TypeScript)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐      ┌──────────────────────┐          │
│  │  Forgot Password     │      │   Reset Password     │          │
│  │  Page                │      │   Page               │          │
│  │  /auth/forgot-pwd    │      │   /auth/reset-pwd    │          │
│  └──────┬───────────────┘      └──────┬───────────────┘          │
│         │                              │                          │
│         ▼                              ▼                          │
│  ┌──────────────────┐          ┌────────────────────┐            │
│  │ ForgotPasswordFrm│          │ ResetPasswordForm  │            │
│  └──────┬───────────┘          └────────┬───────────┘            │
│         │                               │                        │
│         ▼                               ▼                        │
│  ┌────────────────────────┐   ┌──────────────────────┐          │
│  │ useForgotPassword Hook │   │ useResetPassword Hk │          │
│  │ - Form validation      │   │ - Token extraction  │          │
│  │ - API call             │   │ - Form validation   │          │
│  │ - Toast notification   │   │ - API call          │          │
│  └────────┬───────────────┘   │ - Auto redirect     │          │
│           │                    │ - Toast notification│          │
│           ▼                    └──────┬──────────────┘          │
│  ┌─────────────────────────────────────┐                        │
│  │  authApi (RTK Query)                │                        │
│  │  - useForgotPasswordMutation        │                        │
│  │  - useResetPasswordMutation         │                        │
│  └────────┬────────────────────────────┘                        │
│           │                                                      │
└───────────┼──────────────────────────────────────────────────────┘
            │
            │ HTTP Requests/Responses
            │
┌───────────▼──────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Routes                                                           │
│  ├─ POST /auth/forgot-password                                   │
│  └─ POST /auth/reset-password                                    │
│           │                                                       │
│           ▼                                                       │
│  Controllers (authController)                                    │
│  ├─ forgotPassword() Handler                                     │
│  │  └─ Validates request                                         │
│  │  └─ Calls service                                             │
│  │  └─ Returns response                                          │
│  │                                                               │
│  └─ resetPassword() Handler                                      │
│     └─ Validates request                                         │
│     └─ Calls service                                             │
│     └─ Returns response                                          │
│           │                                                       │
│           ▼                                                       │
│  Services (authServices)                                         │
│  ├─ forgotPassword()                                             │
│  │  ├─ Find user by email                                        │
│  │  ├─ Check email verified                                      │
│  │  ├─ Generate token (32 random bytes)                          │
│  │  ├─ Hash token (SHA-256)                                      │
│  │  ├─ Calculate expiry (15 min)                                 │
│  │  ├─ Store hashed token in DB                                  │
│  │  ├─ Generate email with plain token                           │
│  │  └─ Send email via SendGrid                                   │
│  │                                                               │
│  └─ resetPassword()                                              │
│     ├─ Hash received token                                       │
│     ├─ Find token record in DB                                   │
│     ├─ Validate token exists                                     │
│     ├─ Validate token not expired                                │
│     ├─ Validate token not used                                   │
│     ├─ Find and validate user                                    │
│     ├─ Hash new password (bcryptjs)                              │
│     ├─ Update user password                                      │
│     ├─ Mark token as used                                        │
│     ├─ Revoke all refresh tokens                                 │
│     └─ Return success                                            │
│           │                                                       │
│           ▼                                                       │
│  Repositories (authRepository)                                   │
│  ├─ findByEmail()                                                │
│  ├─ createForgotPassword()                                       │
│  ├─ findRSesetPasswordToken()                                    │
│  ├─ updatePassword()                                             │
│  ├─ markPasswordResetTokenAsUsed()                               │
│  └─ revokeRefreshTokensByUserId()                                │
│           │                                                       │
│           ▼                                                       │
│  Prisma ORM                                                      │
│           │                                                       │
│           ▼                                                       │
└───────────┼────────────────────────────────────────────────────────┘
            │
            │ Database Queries
            │
┌───────────▼────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Collections:                                                      │
│  ├─ users                                                          │
│  │  ├─ _id                                                        │
│  │  ├─ email                                                      │
│  │  ├─ password (hashed)                                          │
│  │  ├─ isVerified                                                 │
│  │  └─ ... other fields                                           │
│  │                                                                │
│  └─ password_resets                                               │
│     ├─ _id                                                        │
│     ├─ userId (indexed)                                           │
│     ├─ hashedToken (unique, indexed)                              │
│     ├─ expiresAt (indexed)                                        │
│     ├─ usedAt (nullable)                                          │
│     ├─ ipAddress (optional)                                       │
│     └─ createdAt, updatedAt                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
            ▲
            │ Email Service
            │
┌───────────┴────────────────────────────────────────────────────────┐
│                   EMAIL SERVICE (SendGrid)                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ├─ sendPasswordResetEmail()                                      │
│  │  ├─ From: noreply@yourdomain.com                              │
│  │  ├─ To: user@email.com                                        │
│  │  ├─ Template: passwordResetEmailTemplate()                    │
│  │  ├─ Link: /auth/reset-password?token=PLAIN_TOKEN             │
│  │  └─ Subject: Password Reset Request                           │
│  │                                                                │
│  └─ HTML Email Contains:                                          │
│     ├─ Professional branding                                      │
│     ├─ Plain text explanation                                     │
│     ├─ Reset button/link                                          │
│     ├─ 15-minute expiration notice                               │
│     ├─ Security notice                                            │
│     └─ Footer with company info                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request/Response Flow

### 1. Forgot Password Flow

```
STEP 1: User initiates password reset
┌─────────────────┐
│   User clicks   │
│"Forgot Password"│
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ Enters email address │
└────────┬─────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ Clicks "Send reset link" button        │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ Frontend validates email format        │
└────────┬─────────────────────────────────┘
         │
         ▼
    ╔════════════════════════════════════════╗
    ║  POST /auth/forgot-password            ║
    ║  Body: { email: "user@company.com" }   ║
    ╚════════════╤═════════════════════════════╝
                 │
                 ▼
    ┌──────────────────────────────────────────┐
    │ Backend: Validate email exists & verified│
    │ Generate secure token (32 bytes)         │
    │ Hash token: SHA-256                      │
    │ Calculate expiry: NOW + 15 minutes       │
    │ Store: { userId, hashedToken, expiresAt,│
    │         usedAt: null, createdAt: NOW }   │
    └──────────┬───────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────────┐
    │ Send email with plain token:             │
    │ Link: /auth/reset-password?token=PLAIN   │
    │ Expires in: 15 minutes                   │
    └──────────┬───────────────────────────────┘
               │
               ▼
    ╔════════════════════════════════════════╗
    ║  200 OK                                ║
    ║  {                                     ║
    ║    status: "success",                  ║
    ║    message: "Email sent successfully"  ║
    ║  }                                     ║
    ╚════════╤═══════════════════════════════╝
             │
             ▼
    ┌──────────────────────────────────────┐
    │ Frontend: Show success toast          │
    │ "Check your email for reset link"     │
    │ Clear form fields                     │
    └──────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────┐
    │ User checks email inbox              │
    │ Clicks reset link with token         │
    │ Redirected to reset password page    │
    └──────────────────────────────────────┘
```

### 2. Reset Password Flow

```
STEP 2: User receives email and clicks link
┌──────────────────────────────────────────┐
│ Email Link:                              │
│ /auth/reset-password?token=BASE64_TOKEN  │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Frontend: Extract token from URL         │
│ Display reset password form              │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ User enters new password (min 8 chars)   │
│ User confirms password                   │
│ Clicks "Reset Password"                  │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Frontend validation:                     │
│ ├─ Passwords match?                     │
│ ├─ Min 8 characters?                    │
│ └─ Token present?                       │
└────────┬─────────────────────────────────┘
         │
         ▼
    ╔════════════════════════════════════════╗
    ║ POST /auth/reset-password              ║
    ║ Body: {                                ║
    ║   token: "plain_token",                ║
    ║   newPassword: "NewPass123!",          ║
    ║   confirmPassword: "NewPass123!"       ║
    ║ }                                      ║
    ╚════════════╤═════════════════════════════╝
                 │
                 ▼
    ┌──────────────────────────────────────────┐
    │ Backend Validation Chain:                │
    │                                          │
    │ 1. Hash received token (SHA-256)         │
    │ 2. Find token record in DB               │
    │    └─ If not found: 401 Invalid token    │
    │                                          │
    │ 3. Check token not expired               │
    │    └─ If expired: 401 Token expired      │
    │                                          │
    │ 4. Check token not already used          │
    │    ├─ Query: usedAt IS NOT NULL          │
    │    └─ If used: 401 Link already used     │
    │                                          │
    │ 5. Find user (userId from token record)  │
    │    └─ If not found: 404 User not found   │
    │                                          │
    │ 6. Check user is active                  │
    │    └─ If inactive: 401 Account inactive  │
    │                                          │
    │ 7. Password validation                   │
    │    └─ Passwords match (already done FE)  │
    │                                          │
    └──────────┬───────────────────────────────┘
               │
               ▼ (All validations passed)
    ┌──────────────────────────────────────────┐
    │ Hash new password: bcryptjs (12 rounds)   │
    │ Update user.password = hashedPassword     │
    │ Mark token as used: usedAt = NOW          │
    │ Revoke all refresh tokens for user        │
    │ (Prevents other sessions from continuing) │
    └──────────┬───────────────────────────────┘
               │
               ▼
    ╔════════════════════════════════════════╗
    ║ 200 OK                                 ║
    ║ {                                      ║
    ║   status: "success",                   ║
    ║   message: "Password reset successful" ║
    ║ }                                      ║
    ╚════════╤═══════════════════════════════╝
             │
             ▼
    ┌──────────────────────────────────────────┐
    │ Frontend: Show success toast             │
    │ "Password reset successfully"            │
    │ Wait 2 seconds                           │
    │ Redirect to /auth/login                  │
    └──────────┬───────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────────┐
    │ User logs in with new password           │
    │ Session token issued                     │
    │ Redirected to dashboard                  │
    └──────────────────────────────────────────┘
```

---

## 🛡️ Security Validation Chain

```
Reset Password Request
│
├─ Validate token exists in DB
│  └─ Error: "Invalid reset token"
│
├─ Validate token not expired
│  ├─ expiresAt > NOW
│  └─ Error: "Token has expired"
│
├─ Validate token not used
│  ├─ usedAt IS NULL
│  └─ Error: "Link already used"
│
├─ Validate user exists
│  └─ Error: "User not found"
│
├─ Validate user is active
│  ├─ isActive = true
│  └─ Error: "Account deactivated"
│
├─ Validate passwords match
│  ├─ newPassword === confirmPassword
│  └─ Error: "Passwords don't match"
│
├─ Validate password length
│  ├─ length >= 8
│  └─ Error: "Password too short"
│
└─ All validations passed
   ├─ Hash password (bcryptjs, 12 rounds)
   ├─ Update password
   ├─ Mark token used
   ├─ Revoke all sessions
   └─ Return 200 OK
```

---

## 📊 Database Query Performance

```
Forgot Password:
├─ findByEmail(email) - Fast (email indexed, unique)
└─ createForgotPassword() - Fast (insert)
  
Reset Password:
├─ findRSesetPasswordToken(hash) - Fast (hashedToken unique, indexed)
├─ findById(userId) - Fast (primary key)
├─ updatePassword(userId, hash) - Fast (primary key update)
├─ markPasswordResetTokenAsUsed(hash) - Fast (unique index update)
└─ revokeRefreshTokensByUserId(userId) - Fast (userId indexed)

Total: ~10-50ms per operation depending on DB latency
```

---

## 🔐 Token Security Diagram

```
┌─────────────────────────────────────────────────────────┐
│               TOKEN GENERATION & STORAGE                 │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ 1. Backend generates:                                    │
│    plainToken = randomBytes(32).toString("base64url")   │
│                                                           │
│    Example:                                              │
│    "k3mL9pX_zQ4rT8vW2aB5cD6eF7gH8iJ9kL0mN1oP2qR3s"     │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ 2. Hash for storage:                                     │
│    hashedToken = SHA256(plainToken)                     │
│                                                           │
│    Example:                                              │
│    "3f7d2b1c9e4a8f6d5c2e1b0a9f8d7c6b5a4e3f2d1c0b9a"     │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ 3. Store in database:                                    │
│    PasswordReset {                                       │
│      userId: "123abc",                                   │
│      hashedToken: "3f7d2b1c...",  ← Stored (never shown)│
│      expiresAt: Date(now + 15min),                      │
│      usedAt: null,                                       │
│      createdAt: Date.now()                               │
│    }                                                      │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ 4. Send in email:                                        │
│    Link: /auth/reset-password?token=k3mL9pX_zQ4rT8vW...│
│           ↑ Plain token sent (frontend receives this)   │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ 5. User clicks, frontend extracts token from URL:       │
│    token = "k3mL9pX_zQ4rT8vW2aB5cD6eF7gH8iJ9kL0mN1oP2qR3s"│
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ 6. Frontend sends reset request:                         │
│    POST /auth/reset-password                            │
│    Body: {                                               │
│      token: "k3mL9pX_zQ4rT8vW2aB5cD6eF7gH8iJ9...",    │
│      newPassword: "...",                                 │
│      confirmPassword: "..."                              │
│    }                                                      │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ 7. Backend verification:                                 │
│    receivedHash = SHA256(token)                         │
│    storedHash = "3f7d2b1c..."  ← From DB                │
│    if (receivedHash === storedHash) {                    │
│      ✓ Token valid                                       │
│    } else {                                              │
│      ✗ Token invalid (tampering detected)               │
│    }                                                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Key Security Points:**
- ✅ Plain token never stored in database
- ✅ Hashed token cannot be reversed to get plain token
- ✅ Even if database is compromised, plain tokens are safe
- ✅ Email contains plain token which is what user needs
- ✅ Backend always hashes received token for comparison
- ✅ One-time use prevents replay attacks
- ✅ 15-minute expiration limits attack window

---

## 📱 Frontend Architecture

```
App.tsx
├─ Router Configuration
│  ├─ Public Routes
│  │  ├─ /auth/forgot-password → ForgotPasswordPage
│  │  └─ /auth/reset-password → ResetPasswordPage
│  │
│  └─ Protected Routes
│     └─ /dashboard
│
├─ ForgotPasswordPage
│  └─ ForgotPasswordForm
│     ├─ useForgotPassword() Hook
│     │  ├─ useForm (React Hook Form)
│     │  ├─ useForgotPasswordMutation (RTK Query)
│     │  └─ useNavigate
│     │
│     └─ FormField × 1 (email)
│
├─ ResetPasswordPage
│  └─ ResetPasswordForm
│     ├─ useResetPassword() Hook
│     │  ├─ useForm (React Hook Form)
│     │  ├─ useResetPasswordMutation (RTK Query)
│     │  ├─ useSearchParams (URL token)
│     │  └─ useNavigate
│     │
│     └─ FormField × 2 (password, confirm)
│
└─ API Integration (RTK Query)
   └─ authApi
      ├─ useForgotPasswordMutation
      └─ useResetPasswordMutation
```

---

## Summary

This complete architecture ensures:
- ✅ **Security:** Token hashing, one-time use, expiration
- ✅ **Reliability:** Comprehensive validation on both sides
- ✅ **User Experience:** Clear feedback, auto-redirects
- ✅ **Performance:** Indexed queries, efficient operations
- ✅ **Scalability:** Stateless token design
- ✅ **Maintainability:** Clean separation of concerns
