# Dialog & Form Field Pattern

## Nguyên tắc chung

1. **Ưu tiên components có sẵn** — `Dialog`, `Field`, `FieldGroup`, `Button`, `Input`, `Textarea`, `Select`... Chỉ viết custom UI khi được yêu cầu rõ ràng.
2. **Dialog dùng ref pattern** — modal tự quản lý state nội bộ (`open`, `dismiss`); caller chỉ cần `ref.current?.open(options)`.
3. **`FieldLabel` là mặc định** — chỉ dùng `FieldLegend` khi field là nhóm nhiều controls ở nhiều dòng (một dòng thì vẫn dùng `FieldLabel`) hoặc được yêu cầu rõ ràng.
4. **Không hardcode padding/spacing trên DialogContent nếu không cần thiết**

---

## 1. Dialog đơn giản (ref pattern)

Modal tự quản lý `open` state. Không nhận `open` / `onOpenChange` props từ ngoài.

```tsx
// components/shared/confirm-delete-modal.tsx
import { useImperativeHandle, useRef, useState, type Ref } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export type ConfirmDeleteModalRef = {
  open: (options: { itemName: string; onConfirm: () => void }) => void
}

export const ConfirmDeleteModal = ({ ref }: { ref?: Ref<ConfirmDeleteModalRef> }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const onConfirmCallback = useRef<(() => void) | null>(null)

  useImperativeHandle(ref, () => ({
    open: ({ itemName, onConfirm }) => {
      setItemName(itemName)
      onConfirmCallback.current = onConfirm
      setIsOpen(true)
    },
  }))

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {itemName}?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button
            variant='destructive'
            onClick={() => {
              onConfirmCallback.current?.()
              setIsOpen(false)
            }}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

**Cách dùng:**

```tsx
const deleteRef = useRef<ConfirmDeleteModalRef>(null)

// Mở modal
deleteRef.current?.open({
  itemName: driver.name,
  onConfirm: () => mutateDelete(driver.id),
})

// JSX — không có state nào liên quan đến modal
<ConfirmDeleteModal ref={deleteRef} />
```

---

## 2. Dialog + Form fields

Dùng `FieldGroup` > `Field` > `FieldLabel` + control. `FieldError` hiển thị lỗi validation. `DialogClose asChild` cho nút Cancel.

```tsx
// components/shared/edit-profile-modal.tsx
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const EditProfileModal = ({ ref }: { ref?: Ref<EditProfileModalRef> }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your display name.</DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='name'>Name</FieldLabel>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FieldError>{error}</FieldError>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 3. Form fields độc lập (ngoài dialog)

Dùng trực tiếp `FieldGroup` + `Field` trong page/section.

```tsx
// pages/settings/profile-section.tsx
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const ProfileSection = () => (
  <form onSubmit={handleSubmit}>
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor='display-name'>Display Name</FieldLabel>
        <FieldDescription>Shown publicly on your profile.</FieldDescription>
        <Input id='display-name' defaultValue='John' />
        <FieldError errors={errors.displayName} />
      </Field>

      <Field>
        <FieldLabel htmlFor='bio'>Bio</FieldLabel>
        <Textarea id='bio' defaultValue='...' />
      </Field>
    </FieldGroup>

    <Button type='submit'>Save changes</Button>
  </form>
)
```

---

## Khi nào dùng FieldLegend vs FieldLabel

| Component | HTML | Dùng khi |
|---|---|---|
| `FieldLabel` | `<label>` | Field có **1 control** rõ ràng (Input, Select, Textarea). Liên kết qua `htmlFor`. |
| `FieldLegend` | `<legend>` | Field là **nhóm** gồm nhiều controls liên quan ở nhiều dòng (một dòng thì vẫn dùng `FieldLabel`) hoặc được yêu cầu rõ ràng. Không dùng `htmlFor`. |

```tsx
// ✅ FieldLabel — 1 input
<Field>
  <FieldLabel htmlFor='email'>Email</FieldLabel>
  <Input id='email' type='email' />
</Field>

// ✅ FieldLegend — nhóm nhiều controls
<Field>
  <FieldLegend>Work Hours</FieldLegend>
  <div className='flex gap-2'>
    <Select>...</Select>  {/* start time */}
    <Select>...</Select>  {/* end time */}
  </div>
</Field>

// ❌ Sai — dùng FieldLegend cho 1 input đơn
<Field>
  <FieldLegend>Email</FieldLegend>
  <Input id='email' />
</Field>
```

---

## Checklist nhanh

- [ ] Dialog dùng `ref` pattern — không nhận `open` props từ ngoài
- [ ] Callback lưu trong `useRef`, không dùng state để lưu hàm
- [ ] `DialogClose asChild` cho nút Cancel — không `onClick={() => setIsOpen(false)}` thủ công
- [ ] Dùng `FieldGroup` > `Field` > `FieldLabel` / `FieldLegend` thay cho `div` + `h3` tự custom
- [ ] `FieldError` cho validation message thay cho `<p className='text-danger'>` thủ công
- [ ] Không hardcode padding/spacing trên DialogContent nếu không cần thiết
