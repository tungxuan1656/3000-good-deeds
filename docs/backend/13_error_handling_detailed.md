# 13. ERROR HANDLING & ERROR CODES

## 1. Mục đích

Tài liệu này định nghĩa:
- Cấu trúc error response chuẩn
- Danh sách error codes đầy đủ
- Cách xử lý errors trong backend
- Cách frontend xử lý errors

---

## 2. Error Response Structure

### 2.1. Standard Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": [
      {
        "field": "categoryId",
        "message": "Danh mục không tồn tại"
      }
    ],
    "requestId": "req_abc123"
  }
}
```

### 2.2. TypeScript Interface

```typescript
interface ErrorResponse {
  error: {
    code: ErrorCode
    message: string
    details?: ErrorDetail[] | string
    requestId?: string
  }
}

interface ErrorDetail {
  field: string
  message: string
}

type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'AUTH_FAILED'
  | 'TOKEN_EXPIRED'
  | 'INVALID_TOKEN'
  | 'RESOURCE_CONFLICT'
```

---

## 3. HTTP Status Codes & Error Codes Mapping

| HTTP Status | Error Code                | Meaning            | User Message                                       |
| ----------- | ------------------------- | ------------------ | -------------------------------------------------- |
| 400         | `VALIDATION_ERROR`        | Invalid input      | "Dữ liệu không hợp lệ"                             |
| 400         | `AUTH_FAILED`             | OAuth failed       | "Đăng nhập thất bại. Vui lòng thử lại."            |
| 401         | `AUTHENTICATION_REQUIRED` | No token           | "Vui lòng đăng nhập"                               |
| 401         | `TOKEN_EXPIRED`           | JWT expired        | "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại." |
| 401         | `INVALID_TOKEN`           | JWT invalid        | "Phiên đăng nhập không hợp lệ"                     |
| 403         | `FORBIDDEN`               | No permission      | "Bạn không có quyền thực hiện hành động này"       |
| 404         | `NOT_FOUND`               | Resource not found | "Không tìm thấy tài nguyên"                        |
| 409         | `RESOURCE_CONFLICT`       | Duplicate/conflict | "Tài nguyên đã tồn tại hoặc xung đột"              |
| 429         | `RATE_LIMIT_EXCEEDED`     | Too many requests  | "Quá nhiều yêu cầu. Vui lòng thử lại sau."         |
| 500         | `INTERNAL_ERROR`          | Server error       | "Lỗi hệ thống. Vui lòng thử lại sau."              |
| 503         | `SERVICE_UNAVAILABLE`     | Service down       | "Dịch vụ tạm thời không khả dụng"                  |

---

## 4. Detailed Error Scenarios

### 4.1. Authentication Errors

#### 4.1.1. No Token
```http
GET /api/v1/deeds
Authorization: (missing)
```

**Response (401):**
```json
{
  "error": {
    "code": "AUTHENTICATION_REQUIRED",
    "message": "Vui lòng đăng nhập"
  }
}
```

#### 4.1.2. Token Expired
```http
Authorization: Bearer eyJhbGc... (expired JWT)
```

**Response (401):**
```json
{
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
  }
}
```

**Frontend Action:** Auto refresh token, or redirect to login.

#### 4.1.3. Invalid Token
```http
Authorization: Bearer invalid_token_string
```

**Response (401):**
```json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Phiên đăng nhập không hợp lệ"
  }
}
```

**Frontend Action:** Clear token, redirect to login.

---

### 4.2. Validation Errors

#### 4.2.1. Missing Required Fields
```http
POST /api/v1/deeds
{
  "description": "Test"
  // Missing: categoryId, performedAt
}
```

**Response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": [
      {
        "field": "categoryId",
        "message": "Trường bắt buộc"
      },
      {
        "field": "performedAt",
        "message": "Trường bắt buộc"
      }
    ]
  }
}
```

#### 4.2.2. Invalid Foreign Key
```http
POST /api/v1/deeds
{
  "categoryId": "cat_invalid",
  "performedAt": 1706500000000
}
```

**Response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": [
      {
        "field": "categoryId",
        "message": "Danh mục không tồn tại"
      }
    ]
  }
}
```

#### 4.2.3. Invalid Date Range
```http
GET /api/v1/deeds?from=1706600000000&to=1706500000000
```

**Response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Khoảng thời gian không hợp lệ",
    "details": "from phải nhỏ hơn hoặc bằng to"
  }
}
```

---

### 4.3. Resource Not Found

```http
GET /api/v1/deeds/deed_notexist
```

**Response (404):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Không tìm thấy việc thiện"
  }
}
```

---

### 4.4. Forbidden (Permission Denied)

```http
DELETE /api/v1/deeds/deed_belongs_to_another_user
```

**Response (403):**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Bạn không có quyền xoá việc thiện này"
  }
}
```

---

### 4.5. Resource Conflict

#### 4.5.1. Duplicate Goal
```http
POST /api/v1/goals
{
  "type": "daily",
  "targetCount": 1
}
```

**Case:** User đã có 1 goal daily active.

**Response (409):**
```json
{
  "error": {
    "code": "RESOURCE_CONFLICT",
    "message": "Bạn đã có mục tiêu hằng ngày đang hoạt động",
    "details": "Chỉ có thể có 1 mục tiêu active mỗi loại"
  }
}
```

---

### 4.6. Rate Limiting

```http
POST /api/v1/auth/google
(Too many requests in short time)
```

**Response (429):**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Quá nhiều yêu cầu. Vui lòng thử lại sau 60 giây.",
    "details": {
      "retryAfter": 60
    }
  }
}
```

**Headers:**
```
Retry-After: 60
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1706500120
```

---

### 4.7. Internal Server Error

```http
POST /api/v1/deeds
(Database connection failed)
```

**Response (500):**
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Lỗi hệ thống. Vui lòng thử lại sau.",
    "requestId": "req_abc123"
  }
}
```

**Backend:** Log full error stack, but don't expose to client.

---

## 5. Backend Implementation

### 5.1. Error Handler Middleware

```typescript
// src/middlewares/errorHandler.ts
import { Context } from 'hono'

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message)
  }
}

export function errorHandler(err: Error, c: Context) {
  console.error('Error:', err)
  
  if (err instanceof AppError) {
    return c.json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId: c.get('requestId')
      }
    }, err.statusCode)
  }
  
  // Unknown error
  return c.json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
      requestId: c.get('requestId')
    }
  }, 500)
}
```

### 5.2. Usage in Routes

```typescript
// src/routes/deeds.ts
app.post('/deeds', authMiddleware, async (c) => {
  const body = await c.req.json()
  
  // Validation
  if (!body.categoryId) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Dữ liệu không hợp lệ',
      400,
      [{ field: 'categoryId', message: 'Trường bắt buộc' }]
    )
  }
  
  // Check category exists
  const category = await getCategory(c.env.DB, body.categoryId)
  if (!category) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Dữ liệu không hợp lệ',
      400,
      [{ field: 'categoryId', message: 'Danh mục không tồn tại' }]
    )
  }
  
  // Create deed
  try {
    const deed = await createDeed(c.env.DB, {
      userId: c.get('userId'),
      ...body
    })
    return c.json({ id: deed.id }, 201)
  } catch (error) {
    console.error('Failed to create deed:', error)
    throw new AppError(
      'INTERNAL_ERROR',
      'Không thể tạo việc thiện. Vui lòng thử lại.',
      500
    )
  }
})
```

### 5.3. Validation with Zod

```typescript
import { z } from 'zod'

const createDeedSchema = z.object({
  categoryId: z.string().min(1, 'Trường bắt buộc'),
  description: z.string().optional(),
  performedAt: z.number().int().positive('Thời gian không hợp lệ'),
  isPrivate: z.boolean().default(true)
})

app.post('/deeds', authMiddleware, async (c) => {
  const body = await c.req.json()
  
  const result = createDeedSchema.safeParse(body)
  if (!result.success) {
    const details = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }))
    
    throw new AppError(
      'VALIDATION_ERROR',
      'Dữ liệu không hợp lệ',
      400,
      details
    )
  }
  
  // Continue with validated data
  const validatedData = result.data
  // ...
})
```

---

## 6. Frontend Error Handling

### 6.1. Axios Interceptor

```typescript
// src/lib/api.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

// Request interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401) {
      const errorCode = error.response.data?.error?.code
      
      if (errorCode === 'TOKEN_EXPIRED' && !originalRequest._retry) {
        originalRequest._retry = true
        
        try {
          // Try refresh token
          const newToken = await refreshAccessToken()
          useAuthStore.getState().setToken(newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed → logout
          useAuthStore.getState().logout()
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
      
      if (errorCode === 'INVALID_TOKEN' || errorCode === 'AUTHENTICATION_REQUIRED') {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
```

### 6.2. Error Display Component

```tsx
// src/components/ErrorMessage.tsx
interface ErrorMessageProps {
  error: any
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null
  
  const errorData = error.response?.data?.error
  
  if (!errorData) {
    return <div className="text-red-600">Đã xảy ra lỗi không xác định</div>
  }
  
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="text-sm font-medium text-red-800">
        {errorData.message}
      </div>
      
      {Array.isArray(errorData.details) && (
        <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
          {errorData.details.map((detail: any, idx: number) => (
            <li key={idx}>{detail.message}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### 6.3. Toast Notifications

```tsx
// src/hooks/useErrorToast.ts
import { toast } from 'sonner' // or your toast library

export function useErrorToast() {
  return (error: any) => {
    const errorData = error.response?.data?.error
    
    if (!errorData) {
      toast.error('Đã xảy ra lỗi không xác định')
      return
    }
    
    toast.error(errorData.message)
  }
}

// Usage
function CreateDeedForm() {
  const showError = useErrorToast()
  
  const mutation = useMutation({
    mutationFn: createDeed,
    onError: showError,
    onSuccess: () => {
      toast.success('Đã ghi nhận việc thiện')
    }
  })
  
  // ...
}
```

---

## 7. Logging & Monitoring

### 7.1. Log Format

```typescript
// All errors should be logged with:
console.error('Error context', {
  code: error.code,
  statusCode: error.statusCode,
  userId: userId || 'anonymous',
  endpoint: c.req.path,
  method: c.req.method,
  requestId: requestId,
  timestamp: Date.now(),
  // DON'T log sensitive data (tokens, passwords)
})
```

### 7.2. Metrics to Track

- Error rate by endpoint
- Error rate by error code
- 5xx errors (critical)
- 4xx errors (validation issues)
- Auth failures

### 7.3. Alerting

Setup alerts for:
- 5xx error rate > 1%
- Auth failure rate > 5%
- Any INTERNAL_ERROR

---

## 8. Testing Error Scenarios

### 8.1. Unit Tests

```typescript
describe('POST /deeds', () => {
  it('should return VALIDATION_ERROR when categoryId is missing', async () => {
    const response = await request(app)
      .post('/api/v1/deeds')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        performedAt: Date.now()
      })
    
    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe('VALIDATION_ERROR')
    expect(response.body.error.details).toContainEqual({
      field: 'categoryId',
      message: expect.any(String)
    })
  })
  
  it('should return NOT_FOUND when deed does not exist', async () => {
    const response = await request(app)
      .get('/api/v1/deeds/nonexistent')
      .set('Authorization', `Bearer ${validToken}`)
    
    expect(response.status).toBe(404)
    expect(response.body.error.code).toBe('NOT_FOUND')
  })
})
```

---

## 9. Error Code Reference Table

| Code                      | Status | When               | User Action              |
| ------------------------- | ------ | ------------------ | ------------------------ |
| `VALIDATION_ERROR`        | 400    | Invalid input      | Fix input and retry      |
| `AUTH_FAILED`             | 400    | OAuth failed       | Retry login              |
| `AUTHENTICATION_REQUIRED` | 401    | No token           | Login                    |
| `TOKEN_EXPIRED`           | 401    | JWT expired        | Auto refresh or re-login |
| `INVALID_TOKEN`           | 401    | Invalid JWT        | Re-login                 |
| `FORBIDDEN`               | 403    | No permission      | N/A                      |
| `NOT_FOUND`               | 404    | Resource missing   | N/A                      |
| `RESOURCE_CONFLICT`       | 409    | Duplicate/conflict | Resolve conflict         |
| `RATE_LIMIT_EXCEEDED`     | 429    | Too many requests  | Wait and retry           |
| `INTERNAL_ERROR`          | 500    | Server error       | Retry later              |
| `SERVICE_UNAVAILABLE`     | 503    | Service down       | Retry later              |

---

## 10. Kết luận

Error handling tốt cần:
- ✅ Consistent error response structure
- ✅ Clear error codes
- ✅ User-friendly messages
- ✅ Proper logging (without sensitive data)
- ✅ Frontend auto-retry for recoverable errors
- ✅ Graceful degradation

Tài liệu này là reference duy nhất cho tất cả error handling trong dự án.
