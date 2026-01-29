# 01. Naming Convention – Quy ước đặt tên Backend

## 1. Mục tiêu

Tài liệu này định nghĩa **quy ước đặt tên chuẩn** cho backend dự án **3000 Việc Thiện**, nhằm:

- Giảm tranh cãi khi code
- Đảm bảo code dễ đọc – dễ hiểu – dễ bảo trì
- 6–12 tháng quay lại vẫn hiểu nhanh logic

Nguyên tắc xuyên suốt:
> **Rõ ràng hơn ngắn gọn – nhất quán hơn thông minh**

---

## 2. Nguyên tắc cốt lõi

### 2.1. Một khái niệm → một tên duy nhất

Mỗi khái niệm nghiệp vụ chỉ được **đặt một tên chuẩn** và dùng xuyên suốt:

- Database
- API
- Code backend
- Response JSON

Ví dụ:
- `goodDeed` (chuẩn)
- Không dùng song song: `charity`, `merit`, `kindness`

---

### 2.2. Tên phải thể hiện **ý định**, không phải cách làm

❌ Không chấp nhận:
- `handleData()`
- `process()`
- `doStuff()`

✅ Nên dùng:
- `createGoodDeed()`
- `calculateMonthlyStats()`
- `validateCheckinInput()`

---

### 2.3. Backend ưu tiên rõ ràng hơn ngắn

Tên dài nhưng đọc hiểu ngay **được ưu tiên hơn** tên ngắn nhưng mơ hồ.

---

## 3. Quy ước đặt tên BIẾN

### 3.1. Quy tắc chung

- `camelCase`
- Danh từ / cụm danh từ
- Không viết tắt khó hiểu

Ví dụ:
- `userId`
- `goodDeedId`
- `checkinDate`
- `totalGoodDeeds`

---

### 3.2. Boolean variables

Boolean phải đọc được như câu hỏi:

- `isActive`
- `hasCompletedToday`
- `canCheckin`

❌ Tránh:
- `active`
- `completed`
- `ok`

---

### 3.3. Collection & số lượng

- Array → số nhiều: `goodDeeds`
- Count → hậu tố `Count`: `goodDeedCount`

---

## 4. Quy ước đặt tên HÀM

### 4.1. Cấu trúc chuẩn

```
<verb><Object><Condition?>
```

Ví dụ:
- `getUserStats()`
- `createGoodDeed()`
- `canUserCheckinToday()`

---

### 4.2. Nhóm hàm phổ biến

**CRUD**
- `createX`
- `getX`
- `updateX`
- `deleteX`

**Query / list**
- `listX`
- `findXByY`

**Validate / check**
- `isValidX`
- `canUserX`

**Tính toán**
- `calculateX`
- `computeX`

---

### 4.3. Những động từ bị cấm

- `handle`
- `process`
- `do`
- `manage`

---

## 5. Quy ước FILE & FOLDER

### 5.1. File name

- `kebab-case`

Ví dụ:
- `good-deed.service.ts`
- `good-deed.repository.ts`

---

### 5.2. Folder theo domain

```
src/
├── good-deed/
├── stats/
├── goals/
└── achievements/
```

---

## 6. Những điều tuyệt đối tránh

- Đặt tên theo UI (`submitForm`, `clickButton`)
- Dùng tên tạm (`temp`, `data1`, `newData`)
- Dùng nhiều từ cho cùng một khái niệm

---

## 7. Kết luận

Quy ước đặt tên là **luật nền** của backend. Mọi code mới **bắt buộc tuân thủ** tài liệu này.

