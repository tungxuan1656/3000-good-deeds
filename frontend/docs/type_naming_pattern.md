# Type naming pattern (DTO / Request / Response)

## 1) Rule bắt buộc

- Dữ liệu object trao đổi giữa FE/BE: hậu tố `DTO`.
- Kiểu dữ liệu gửi lên API: hậu tố `Request`.
- Kiểu dữ liệu nhận từ API (ngoài wrapper chung): hậu tố `Response`.

## 2) Quy ước đặt tên

- Entity DTO: `UserDTO`, `GoalDTO`, `JournalEntryDTO`.
- API input: `CreateDeedRequest`, `UpdateMeRequest`, `GetGoalHistoryRequest`.
- API output theo nghiệp vụ: `AuthResponse`, `SessionResponse`, `GoalHistoryResponse`.
- Wrapper chung giữ nguyên: `ApiResponse<T>`.

## 3) Mẫu chuẩn

```ts
export type UserDTO = {
  id: string
  email: string
  name: string
}

export type UpdateMeRequest = {
  name?: string
  avatarUrl?: string
}

export type GoalHistoryResponse = {
  items: GoalHistoryItemDTO[]
  pagination: PaginationDTO
}
```

## 4) Cách dùng trong API function

```ts
export const updateMe = async (
  payload: UpdateMeRequest,
): Promise<ApiResponse<UserDTO>> => {
  const response = await client.patch<ApiResponse<UserDTO>>(API_ENDPOINTS.users.me, payload)
  return response.data
}
```

## 5) Không dùng

- `UserData`, `GoalModel`, `Payload`, `Result` (mơ hồ, không theo chuẩn).
- Trộn lẫn DTO với Request/Response trong cùng tên type.

## 6) Checklist nhanh

- [ ] Type object trao đổi dữ liệu đã có hậu tố `DTO`
- [ ] Type input API đã có hậu tố `Request`
- [ ] Type output API theo nghiệp vụ đã có hậu tố `Response`
- [ ] Function API trả `Promise<ApiResponse<...>>` typed rõ ràng
