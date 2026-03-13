# API + React Query pattern (triển khai nhanh)

## 1) Cấu trúc chuẩn

```text
src/
  api/
    client.ts
    endpoints.ts
    <domain>.ts
    <domain>.mock.ts   ← mock fixtures (chỉ dùng khi backend chưa sẵn sàng)
  hooks/api/
    use-<domain>.ts
```

- API layer: chỉ gọi HTTP, typed đầy đủ.
- Hook layer: quản lý cache, key, invalidate, transform data.
- Mock layer: fixtures tách riêng vào `<domain>.mock.ts`, **không nhúng trực tiếp** vào component hoặc hook.

## 2) Rule cứng

- Mọi endpoint khai báo ở `API_ENDPOINTS`.
- Hook query luôn có `queryKey` từ `*_KEYS`.
- Mutation thành công phải `invalidateQueries` đúng scope.
- UI chỉ gọi hook, không gọi trực tiếp file `api/*`.
- **Không dùng `select: (data) => data`** — identity callback không transform gì phải bị xóa hoàn toàn.
- **Trước khi thêm query/hook mới**, kiểm tra xem data có thể derive từ store hoặc query đang có sẵn không — tránh gọi API song song cho dữ liệu đã được fetch.

## 2a) Mock data pattern

Khi backend chưa sẵn sàng, mock phải đặt trong `api/<domain>.mock.ts`, **không nhúng inline** vào component:

```ts
// api/shifts.mock.ts
import type { ShiftSlot } from '@/types/shift'

// Mock fixtures — replace with real HTTP call once backend is available.
export const MOCK_SHIFTS: ShiftSlot[] = [...]
```

API module import và re-export mock kèm TODO rõ ràng:

```ts
// api/shifts.ts
import { MOCK_SHIFTS } from './shifts.mock'

// TODO: Replace with real HTTP call once backend endpoint is available.
// Example: return client.get<ApiResponse<ShiftSlot[]>>(API_ENDPOINTS.shifts.slots)
export const getShiftSlots = async (): Promise<ShiftSlot[]> => {
  return Promise.resolve(MOCK_SHIFTS)
}
```

## 3) Template API module

```ts
// api/example.ts
import type { ApiResponse, ExampleDTO, CreateExampleRequest } from '@/types/api'
import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const getExamples = async (): Promise<ApiResponse<ExampleDTO[]>> => {
  const response = await client.get<ApiResponse<ExampleDTO[]>>(API_ENDPOINTS.examples.list)
  return response.data
}

export const createExample = async (
  payload: CreateExampleRequest,
): Promise<ApiResponse<ExampleDTO>> => {
  const response = await client.post<ApiResponse<ExampleDTO>>(API_ENDPOINTS.examples.list, payload)
  return response.data
}
```

## 4) Template Hook module

```ts
// hooks/api/use-example.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createExample, getExamples } from '@/api/example'

export const EXAMPLE_KEYS = {
  all: ['examples'] as const,
  list: () => [...EXAMPLE_KEYS.all, 'list'] as const,
}

export const useExamples = () => {
  return useQuery({
    queryKey: EXAMPLE_KEYS.list(),
    queryFn: getExamples,
    select: (res) => res.data, // UI nhận data thuần
  })
}

export const useCreateExample = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createExample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAMPLE_KEYS.all })
    },
  })
}
```

## 5) Query key pattern

```ts
export const DOMAIN_KEYS = {
  all: ['domain'] as const,
  list: (params?: unknown) => ['domain', 'list', params] as const,
  detail: (id: string) => ['domain', 'detail', id] as const,
}
```

## 6) Infinite query pattern

```ts
useInfiniteQuery({
  queryKey: DOMAIN_KEYS.list(params),
  queryFn: ({ pageParam }) => getItems({ ...params, cursor: pageParam }),
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (lastPage) =>
    lastPage.success && lastPage.data?.pagination.hasMore
      ? lastPage.data.pagination.nextCursor
      : undefined,
})
```

## 7) Mapping với code hiện tại

- HTTP client + refresh token: [src/api/client.ts](src/api/client.ts)
- Endpoint registry: [src/api/endpoints.ts](src/api/endpoints.ts)
- Hook domain mẫu (query + mutation + invalidate): [src/hooks/api/use-deeds.ts](src/hooks/api/use-deeds.ts)
- Hook infinite query mẫu: [src/hooks/api/use-inner-journal.ts](src/hooks/api/use-inner-journal.ts)
- QueryClient global + cache persist: [src/main.tsx](src/main.tsx)

## 8) Checklist khi thêm API mới

- [ ] Thêm endpoint vào `API_ENDPOINTS`
- [ ] Tạo function trong `api/<domain>.ts`
- [ ] Tạo `*_KEYS` trong `hooks/api/use-<domain>.ts`
- [ ] Viết `useQuery`/`useMutation` tương ứng
- [ ] Add `invalidateQueries` cho mutation
- [ ] Dùng `select` để trả data thuần cho UI — **xóa `select: (data) => data`** nếu không transform
- [ ] Nếu dùng mock: tách riêng vào `api/<domain>.mock.ts` + có comment `// TODO: replace with real HTTP call`
- [ ] Kiểm tra xem data đã có ở store/query khác chưa trước khi tạo hook mới
