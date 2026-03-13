# Zustand store pattern (ngắn gọn để triển khai ngay)

## 1) Template chuẩn

```ts
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import { createSelectors } from './types'

interface ExampleState {
  isReady: boolean
  data: string | null
}

const initialState: ExampleState = {
  isReady: false,
  data: null,
}

const _useExampleStore = create<ExampleState>()(
  devtools(
    persist(
      () => initialState,
      {
        name: 'example-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (s) => ({ data: s.data }), // chỉ persist field cần thiết
      },
    ),
  ),
)

export const exampleActions = {
  markReady: (isReady = true) => _useExampleStore.setState({ isReady }),
  setData: (data: string | null) => _useExampleStore.setState({ data }),
  reset: () => _useExampleStore.setState(initialState),
}

export const useExampleStore = createSelectors(_useExampleStore)
```

## 2) Quy ước bắt buộc

- Tên: `_useXStore`, `useXStore`, `xActions`.
- Chỉ cập nhật state qua `actions`.
- Dùng selector theo key: `useXStore.use.field()`.
- Nếu có persist, luôn dùng `partialize`.
- **Không persist** cờ tạm (`loading`, `error`, `isSessionChecked`, ...).
- **`reset` action là bắt buộc** — cần cho việc khởi tạo lại state và test isolation.

## 2a) Testing requirement (bắt buộc)

Mỗi store mới **phải có file test tương ứng** trong cùng PR, bao gồm:

- Initial state: xác nhận giá trị mặc định đúng.
- Mỗi action (`setX`, `reset`, ...): ít nhất 1 test case happy path + edge case.
- Nếu store có derived selector: test bao phủ cả selector.

```ts
// stores/shift.store.test.ts
beforeEach(() => { act(() => { shiftActions.reset() }) })
aftEreach(() => { act(() => { shiftActions.reset() }) })

describe('shiftActions.setDateRange', () => {
  it('updates dateRange', () => { ... })
  it('accepts undefined to clear', () => { ... })
})

describe('shiftActions.reset', () => {
  it('restores initial state after mutation', () => { ... })
})
```

Test pattern chuẩn: [src/stores/shift.store.test.ts](src/stores/shift.store.test.ts)

## 3) Cách dùng trong component

```ts
const data = useExampleStore.use.data()
const isReady = useExampleStore.use.isReady()

exampleActions.setData('abc')
exampleActions.markReady()
```

## 4) Checklist tạo store mới

- [ ] Có `State` + `initialState`
- [ ] `create(...devtools(persist(...)))`
- [ ] `actions` đầy đủ (`set`, `reset`) — `reset` **bắt buộc**
- [ ] Export `useXStore = createSelectors(_useXStore)`
- [ ] Chỉ persist field thật sự cần
- [ ] Có file `<domain>.store.test.ts` với test cho initial state, mọi action, derived selector
