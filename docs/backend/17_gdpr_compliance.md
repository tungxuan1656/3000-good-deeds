# 17. GDPR COMPLIANCE & DATA PRIVACY

## 1. Mục đích

Tài liệu này định nghĩa:
- GDPR requirements cho ứng dụng
- Data export functionality
- Account deletion process
- Data retention policies
- User consent management

---

## 2. GDPR Overview

### 2.1. Key Principles

1. **Lawfulness, fairness and transparency**
2. **Purpose limitation** - Chỉ thu thập data cần thiết
3. **Data minimisation** - Ít nhất có thể
4. **Accuracy** - Dữ liệu chính xác, cập nhật
5. **Storage limitation** - Không lưu lâu quá mức cần thiết
6. **Integrity and confidentiality** - Bảo mật
7. **Accountability** - Chịu trách nhiệm

### 2.2. User Rights

- ✅ Right to access (export data)
- ✅ Right to rectification (update profile)
- ✅ Right to erasure (delete account)
- ✅ Right to data portability (export in machine-readable format)
- ✅ Right to object (opt-out of features)
- ✅ Right to be informed (privacy policy)

---

## 3. Data We Collect

### 3.1. Personal Data

| Data           | Source                    | Purpose                          | Retention              |
| -------------- | ------------------------- | -------------------------------- | ---------------------- |
| Email          | Google OAuth              | Authentication, account recovery | Until account deletion |
| Display Name   | Google OAuth / User input | Personalization                  | Until account deletion |
| Avatar URL     | Google OAuth              | Profile display                  | Until account deletion |
| Google User ID | Google OAuth              | Link OAuth account               | Until account deletion |

### 3.2. Usage Data

| Data                       | Purpose            | Retention                             |
| -------------------------- | ------------------ | ------------------------------------- |
| Good deeds                 | Core feature       | Until user deletes or account deleted |
| Goals                      | User-created       | Until user deletes or account deleted |
| User achievements          | Gamification       | Until account deleted                 |
| Refresh tokens             | Session management | 30 days or logout                     |
| Settings (reminder, theme) | Personalization    | Until account deleted                 |

### 3.3. Technical Data

| Data                 | Purpose                 | Retention |
| -------------------- | ----------------------- | --------- |
| IP address (in logs) | Security, rate limiting | 7 days    |
| User agent           | Analytics               | 7 days    |
| Request logs         | Debugging, security     | 7 days    |

### 3.4. Data We DON'T Collect

- ❌ Location tracking
- ❌ Third-party cookies
- ❌ Advertising IDs
- ❌ Phone numbers
- ❌ Physical addresses
- ❌ Payment information (no monetization)
- ❌ Sensitive personal data (health, religion, etc. beyond what user voluntarily enters in deed descriptions)

---

## 4. Data Export (Right to Access)

### 4.1. API Endpoint

**`GET /users/me/export`**

**Response:**
```json
{
  "exportedAt": 1706500000000,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "displayName": "Nguyen Van A",
    "avatarUrl": "...",
    "createdAt": 1700000000000,
    "settings": {
      "reminderTime": "20:00",
      "reminderEnabled": true,
      "timezone": "Asia/Ho_Chi_Minh",
      "themePreference": "system",
      "notificationOn": true
    }
  },
  "good_deeds": [
    {
      "id": "deed_1",
      "categoryId": "cat_body",
      "categoryName": "Thân thiện",
      "description": "Helped neighbor",
      "performedAt": 1706500000000,
      "createdAt": 1706500000000,
      "isPrivate": true
    }
  ],
  "goals": [
    {
      "id": "goal_1",
      "title": "1 deed per day",
      "type": "daily",
      "targetCount": 1,
      "startDate": 1706500000000,
      "isActive": true
    }
  ],
  "achievements": [
    {
      "achievementCode": "STREAK_3",
      "achievementTitle": "3 ngày đều đặn",
      "unlockedAt": 1706500000000
    }
  ]
}
```

### 4.2. Backend Implementation

**`src/routes/users.ts`:**
```typescript
app.get('/me/export', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const db = c.env.DB
  
  try {
    // Get user
    const user = await db.prepare(`
      SELECT id, email, display_name, avatar_url, created_at,
             reminder_time, reminder_enabled, timezone, theme_preference, notification_on
      FROM users WHERE id = ?
    `).bind(userId).first()
    
    if (!user) {
      return c.json({ error: { code: 'NOT_FOUND' } }, 404)
    }
    
    // Get good deeds
    const deeds = await db.prepare(`
      SELECT d.id, d.category_id, c.name as category_name, d.description,
             d.performed_at, d.created_at, d.is_private
      FROM good_deeds d
      JOIN categories c ON d.category_id = c.id
      WHERE d.user_id = ?
      ORDER BY d.performed_at DESC
    `).bind(userId).all()
    
    // Get goals
    const goals = await db.prepare(`
      SELECT id, title, type, target_count, start_date, end_date, is_active, created_at
      FROM goals WHERE user_id = ?
    `).bind(userId).all()
    
    // Get achievements
    const achievements = await db.prepare(`
      SELECT ad.code, ad.title, ua.unlocked_at
      FROM user_achievements ua
      JOIN achievement_definitions ad ON ua.achievement_id = ad.id
      WHERE ua.user_id = ?
      ORDER BY ua.unlocked_at DESC
    `).bind(userId).all()
    
    // Compile export
    const exportData = {
      exportedAt: Date.now(),
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
        settings: {
          reminderTime: user.reminder_time,
          reminderEnabled: !!user.reminder_enabled,
          timezone: user.timezone,
          themePreference: user.theme_preference,
          notificationOn: !!user.notification_on
        }
      },
      good_deeds: deeds.results,
      goals: goals.results,
      achievements: achievements.results
    }
    
    // Set headers for download
    c.header('Content-Type', 'application/json')
    c.header('Content-Disposition', `attachment; filename="3000-good-deeds-export-${Date.now()}.json"`)
    
    return c.json(exportData)
    
  } catch (error) {
    console.error('Export error:', error)
    return c.json({ error: { code: 'INTERNAL_ERROR' } }, 500)
  }
})
```

### 4.3. Frontend Implementation

**`src/features/settings/components/DataExport.tsx`:**
```tsx
import { useState } from 'react'
import { Download } from 'lucide-react'
import api from '@/lib/api'

export function DataExport() {
  const [isExporting, setIsExporting] = useState(false)
  
  const handleExport = async () => {
    try {
      setIsExporting(true)
      
      const response = await api.get('/users/me/export', {
        responseType: 'blob'
      })
      
      // Create download link
      const blob = new Blob([response.data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `3000-good-deeds-export-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Đã tải xuống dữ liệu của bạn')
    } catch (error) {
      toast.error('Không thể xuất dữ liệu')
    } finally {
      setIsExporting(false)
    }
  }
  
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium text-gray-900">Xuất dữ liệu</h3>
      <p className="text-sm text-gray-600 mt-1">
        Tải xuống toàn bộ dữ liệu của bạn dưới dạng JSON
      </p>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
      </button>
    </div>
  )
}
```

---

## 5. Account Deletion (Right to Erasure)

### 5.1. API Endpoint

**`DELETE /users/me`**

**Request:**
```json
{
  "confirmation": "DELETE",
  "reason": "optional reason"
}
```

**Response (204 No Content):**
```
(Empty body)
```

### 5.2. Backend Implementation

**`src/routes/users.ts`:**
```typescript
app.delete('/me', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  
  // Require confirmation
  if (body.confirmation !== 'DELETE') {
    return c.json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Xác nhận không đúng'
      }
    }, 400)
  }
  
  const db = c.env.DB
  
  try {
    // Log deletion request (for audit)
    console.log('Account deletion requested', {
      userId,
      reason: body.reason,
      timestamp: Date.now()
    })
    
    // Soft delete: Mark as deleted (optional, or hard delete immediately)
    await db.prepare(`
      UPDATE users 
      SET deleted_at = ?
      WHERE id = ?
    `).bind(Date.now(), userId).run()
    
    // Hard delete (cascade will delete related data due to FK constraints)
    // Alternatively, do this in a background job after 30 days
    await db.prepare('DELETE FROM users WHERE id = ?').bind(userId).run()
    
    // Foreign key cascades will delete:
    // - oauth_accounts
    // - refresh_tokens
    // - good_deeds
    // - goals
    // - user_achievements
    
    return c.body(null, 204)
    
  } catch (error) {
    console.error('Delete account error:', error)
    return c.json({ error: { code: 'INTERNAL_ERROR' } }, 500)
  }
})
```

### 5.3. Frontend Implementation

**`src/features/settings/components/DeleteAccount.tsx`:**
```tsx
import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import api from '@/lib/api'
import { useNavigate } from 'react-router-dom'

export function DeleteAccount() {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [reason, setReason] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  
  const handleDelete = async () => {
    if (confirmation !== 'DELETE') {
      toast.error('Vui lòng nhập "DELETE" để xác nhận')
      return
    }
    
    try {
      setIsDeleting(true)
      
      await api.delete('/users/me', {
        data: { confirmation, reason }
      })
      
      // Logout and redirect
      logout()
      navigate('/deleted')
      toast.success('Tài khoản đã được xoá')
    } catch (error) {
      toast.error('Không thể xoá tài khoản')
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
      <h3 className="font-medium text-red-900">Xoá tài khoản</h3>
      <p className="text-sm text-red-700 mt-1">
        Hành động này không thể hoàn tác. Toàn bộ dữ liệu của bạn sẽ bị xoá vĩnh viễn.
      </p>
      
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Xoá tài khoản
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-2 p-3 bg-red-100 rounded-md">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Dữ liệu sẽ bị xoá:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Tất cả việc thiện đã ghi nhận</li>
                <li>Mục tiêu và thành tựu</li>
                <li>Cài đặt cá nhân</li>
              </ul>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lý do xoá (tuỳ chọn)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300"
              rows={3}
              placeholder="Giúp chúng tôi cải thiện dịch vụ..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nhập "DELETE" để xác nhận
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300"
              placeholder="DELETE"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={confirmation !== 'DELETE' || isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Đang xoá...' : 'Xác nhận xoá'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Huỷ
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## 6. Data Retention Policy

### 6.1. Active Data

| Data Type    | Retention                             |
| ------------ | ------------------------------------- |
| User account | Until user deletes                    |
| Good deeds   | Until user deletes or account deleted |
| Goals        | Until user deletes or account deleted |
| Achievements | Until account deleted                 |
| Settings     | Until account deleted                 |

### 6.2. Deleted Data

| Data Type                  | Retention After Deletion     |
| -------------------------- | ---------------------------- |
| User account (soft delete) | 30 days (recovery period)    |
| User account (hard delete) | Immediate permanent deletion |
| Logs                       | 7 days maximum               |
| Backups                    | 30 days (encrypted)          |

### 6.3. Automated Cleanup

**Scheduled job (via Cloudflare Cron Triggers):**

**`wrangler.toml`:**
```toml
[triggers]
crons = ["0 2 * * *"] # Daily at 2 AM
```

**`src/scheduled.ts`:**
```typescript
export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // Cleanup old logs (if stored in D1)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    await env.DB.prepare('DELETE FROM audit_logs WHERE created_at < ?')
      .bind(sevenDaysAgo)
      .run()
    
    // Cleanup expired refresh tokens
    await env.DB.prepare('DELETE FROM refresh_tokens WHERE expires_at < ?')
      .bind(Date.now())
      .run()
    
    // Hard delete soft-deleted accounts after 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    await env.DB.prepare('DELETE FROM users WHERE deleted_at < ?')
      .bind(thirtyDaysAgo)
      .run()
    
    console.log('Cleanup completed')
  }
}
```

---

## 7. Consent Management

### 7.1. Cookie Consent

**Not needed** if:
- No third-party cookies
- No tracking cookies
- Only essential cookies (auth token in localStorage, not cookies)

### 7.2. Terms Acceptance

**Store in database:**
```sql
ALTER TABLE users ADD COLUMN terms_accepted_at INTEGER;
ALTER TABLE users ADD COLUMN privacy_accepted_at INTEGER;
```

**On first login:**
```tsx
function TermsAcceptance() {
  const acceptTerms = async () => {
    await api.post('/users/me/accept-terms')
    // Continue to app
  }
  
  return (
    <div className="max-w-md mx-auto p-6">
      <h2>Điều khoản sử dụng</h2>
      <div className="prose">
        {/* Terms content */}
      </div>
      <button onClick={acceptTerms}>
        Tôi đồng ý
      </button>
    </div>
  )
}
```

---

## 8. Privacy Policy (Required)

### 8.1. Must Include

- [ ] What data we collect
- [ ] Why we collect it
- [ ] How we use it
- [ ] How long we keep it
- [ ] Who we share it with (none for this app)
- [ ] User rights (access, delete, etc.)
- [ ] Contact information
- [ ] How to file complaints

### 8.2. Location

- `/privacy-policy` page
- Link in footer
- Link in settings
- Link during signup

---

## 9. Security Measures (for GDPR)

### 9.1. Data Encryption

- ✅ HTTPS only (enforced by Cloudflare)
- ✅ Passwords hashed (N/A, OAuth only)
- ✅ Tokens hashed in database
- ✅ Database encrypted at rest (Cloudflare D1)

### 9.2. Access Control

- ✅ JWT authentication
- ✅ Row-level security (user can only access own data)
- ✅ Rate limiting
- ✅ No admin backdoors to user data

### 9.3. Breach Notification

If data breach occurs:
1. **Within 72 hours:** Notify supervisory authority
2. **Without delay:** Notify affected users
3. **Document:** What happened, impact, mitigation

**Procedure:**
1. Detect breach
2. Contain breach
3. Assess impact
4. Notify authorities (GDPR requires)
5. Notify users
6. Document everything

---

## 10. GDPR Checklist (Pre-launch)

**Data Collection:**
- [ ] Only collect necessary data
- [ ] Clear purpose for each data point
- [ ] Document data processing activities

**User Rights:**
- [ ] Data export API implemented
- [ ] Account deletion API implemented
- [ ] Privacy policy published
- [ ] Terms of service published

**Security:**
- [ ] HTTPS enforced
- [ ] Authentication secure
- [ ] Database access restricted
- [ ] Logs don't contain PII

**Retention:**
- [ ] Data retention policy defined
- [ ] Automated cleanup scheduled
- [ ] Backup encryption enabled

**Consent:**
- [ ] Terms acceptance on signup
- [ ] Privacy policy acceptance
- [ ] Opt-in for non-essential features

**Compliance:**
- [ ] Designate data controller (you/your company)
- [ ] Document processing activities
- [ ] Have breach response plan

---

## 11. Ongoing Compliance

### 11.1. Regular Audits

- **Quarterly:** Review data retention
- **Annually:** Review privacy policy
- **On changes:** Update users, get consent if needed

### 11.2. User Requests

**Response time:** 30 days maximum (GDPR requirement)

**Types of requests:**
- Access request → Provide data export
- Deletion request → Delete account
- Rectification → Allow profile edit
- Portability → Provide JSON export

### 11.3. Record Keeping

Keep records of:
- Data processing activities
- User deletion requests
- Data export requests
- Any data breaches (even if minor)

---

## 12. Kết luận

GDPR compliance đảm bảo:
- ✅ User trust
- ✅ Legal protection
- ✅ Respect for privacy
- ✅ Transparent data practices

**Key features implemented:**
- Data export (JSON)
- Account deletion (with confirmation)
- Data retention (automated cleanup)
- Privacy policy & terms
- Secure data handling

Follow tài liệu này để đảm bảo tuân thủ GDPR và bảo vệ quyền riêng tư người dùng.
