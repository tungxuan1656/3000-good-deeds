# Form Pattern (shadcn + react-hook-form + zod)

Pattern chuẩn để viết form trong dự án React + TypeScript theo hướng dẫn của shadcn.

## 1) Nguyên tắc

- Dùng `zod` để định nghĩa schema duy nhất cho validate.
- Dùng `useForm` + `zodResolver` để bind schema vào form.
- Dùng `Controller` cho field dạng controlled (`Select`, `Switch`, `Checkbox`, `RadioGroup`, ...).
- Luôn gắn:
  - `data-invalid={fieldState.invalid}` trên `Field`
  - `aria-invalid={fieldState.invalid}` trên input control
  - `FieldError` để hiển thị lỗi
- `defaultValues` phải đầy đủ theo schema.
- Đặt `id` rõ ràng cho control và map với `FieldLabel htmlFor`.

## 2) Skeleton chuẩn

```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  title: z.string().min(3, 'Tối thiểu 3 ký tự').max(50, 'Tối đa 50 ký tự'),
  description: z.string().min(10, 'Tối thiểu 10 ký tự'),
})

type FormValues = z.infer<typeof formSchema>

export function ExampleForm(): React.JSX.Element {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onSubmit', // có thể đổi onChange/onBlur tùy UX
  })

  const onSubmit = (values: FormValues): void => {
    // call API / mutation
    console.log(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
      <FieldGroup>
        <Controller
          name='title'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='form-title'>Tiêu đề</FieldLabel>
              <Input
                {...field}
                id='form-title'
                aria-invalid={fieldState.invalid}
                placeholder='Nhập tiêu đề'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='description'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='form-description'>Mô tả</FieldLabel>
              <Input
                {...field}
                id='form-description'
                aria-invalid={fieldState.invalid}
                placeholder='Nhập mô tả'
              />
              <FieldDescription>Thông tin này sẽ hiển thị cho người dùng.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className='flex items-center gap-2'>
        <Button type='button' variant='outline' onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type='submit'>Lưu</Button>
      </div>
    </form>
  )
}
```

## 3) Pattern theo loại field

### Input / Textarea

- Spread trực tiếp `...field` vào control.
- Gắn `aria-invalid` + `FieldError`.

### Select

- Bind thủ công `value` + `onValueChange={field.onChange}`.
- Không spread toàn bộ `field` cho `Select`.

### Checkbox / Switch

- Dùng `checked` + `onCheckedChange`.
- Với checkbox array: thao tác mảng bằng `includes`, `filter`, `push` theo `field.value`.

### RadioGroup

- Bind `value` + `onValueChange`.

## 4) Rule triển khai trong dự án

- Schema đặt gần form hoặc tách `*.schema.ts` nếu form lớn.
- Type submit dùng `z.infer<typeof formSchema>` để đồng bộ 100% với schema.
- Lỗi API trả về map về `form.setError` khi cần.
- Form có nhiều khối nên chia nhỏ component theo section, nhưng giữ 1 `useForm` ở root form.

## 5) Checklist PR cho form

- [ ] Có `zodResolver` và schema rõ ràng
- [ ] Có `defaultValues` đầy đủ
- [ ] Có `data-invalid`, `aria-invalid`, `FieldError`
- [ ] Có nút `Reset` (nếu phù hợp)
- [ ] Có xử lý submit/loading/disabled rõ ràng
- [ ] Type-safe bằng `z.infer`
