import { BellIcon, GlobeIcon, LogOutIcon, Trash2Icon, UserIcon } from 'lucide-react'
import { useState } from 'react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CardSection } from '@/components/shared/card-section'
import { DailyQuoteCard } from '@/components/shared/daily-quote-card'
import { MiniCheckInCard } from '@/components/shared/mini-check-in-card'
import { WeeklyRhythmCard } from '@/components/shared/weekly-rhythm-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toggle } from '@/components/ui/toggle'

const SettingsPage = () => {
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteText, setDeleteText] = useState('')

  return (
    <MainContainer>
      <MainColumn>
        <CardSection as='header'>
          <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
            Cài đặt
          </p>
          <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight'>
            Tuỳ chỉnh trải nghiệm
          </h1>
          <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
            Bạn có thể thay đổi nhắc nhở, ngôn ngữ và tài khoản tại đây.
          </p>
        </CardSection>

        <CardSection className='gap-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
                Hồ sơ
              </p>
              <p className='text-foreground mt-2 text-base font-semibold'>Tài khoản của bạn</p>
            </div>
            <div className='bg-secondary/40 flex h-10 w-10 items-center justify-center rounded-full'>
              <UserIcon className='text-primary h-5 w-5' />
            </div>
          </div>

          <div className='flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/80 p-4'>
            <div className='flex items-center gap-4'>
              <div className='bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold'>
                TD
              </div>
              <div>
                <p className='text-foreground text-sm font-semibold'>Tung Doan</p>
                <p className='text-muted-foreground text-xs'>tungdoan@email.com</p>
              </div>
            </div>
            <div className='text-muted-foreground text-xs'>
              Thông tin này được lấy từ tài khoản đăng nhập.
            </div>
          </div>
        </CardSection>

        <CardSection className='gap-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-foreground text-base font-semibold'>Nhắc nhở dịu nhẹ</p>
              <p className='text-muted-foreground mt-1 text-xs'>Chỉ một lần mỗi ngày.</p>
            </div>
            <Toggle pressed={reminderEnabled} onPressedChange={setReminderEnabled}>
              {reminderEnabled ? 'Bật' : 'Tắt'}
            </Toggle>
          </div>
          {reminderEnabled && (
            <div className='flex flex-col gap-2'>
              <Label className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
                Chọn giờ nhắc
              </Label>
              <Input
                className='rounded-2xl border border-black/5 bg-white px-4 py-2 text-sm'
                defaultValue='20:30'
                type='time'
              />
              <p className='text-muted-foreground text-xs'>
                Hệ thống sẽ bỏ qua nhắc nhở nếu bạn đã check-in trong ngày.
              </p>
              <p className='text-muted-foreground text-xs'>
                Thông báo mẫu: “Đến giờ gieo hạt an lành 🌱”.
              </p>
            </div>
          )}
        </CardSection>

        <CardSection className='gap-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-foreground text-base font-semibold'>Ngôn ngữ</p>
              <p className='text-muted-foreground mt-1 text-xs'>Chọn ngôn ngữ hiển thị.</p>
            </div>
            <div className='bg-secondary/40 flex h-9 w-9 items-center justify-center rounded-full'>
              <GlobeIcon className='text-primary h-4 w-4' />
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            <button className='text-foreground rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-medium'>
              Tiếng Việt
            </button>
            <button className='text-muted-foreground rounded-full border border-black/5 bg-white/60 px-4 py-2 text-sm font-medium'>
              English
            </button>
          </div>
        </CardSection>

        <CardSection className='gap-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-foreground text-base font-semibold'>Phiên đăng nhập</p>
              <p className='text-muted-foreground mt-1 text-xs'>Quản lý đăng nhập của bạn.</p>
            </div>
            <div className='bg-secondary/40 flex h-9 w-9 items-center justify-center rounded-full'>
              <BellIcon className='text-primary h-4 w-4' />
            </div>
          </div>
          <Button
            className='text-foreground h-11 w-full rounded-full border border-black/5 bg-white hover:bg-white/80'
            variant='secondary'
            onClick={() => setShowLogoutConfirm(true)}>
            <LogOutIcon className='h-4 w-4' />
            Đăng xuất
          </Button>
        </CardSection>

        {showLogoutConfirm && (
          <CardSection className='border border-black/5 bg-white/80'>
            <div className='flex flex-col gap-3'>
              <div>
                <p className='text-foreground text-sm font-semibold'>Đăng xuất khỏi tài khoản?</p>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Bạn có thể đăng nhập lại bất cứ lúc nào.
                </p>
              </div>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                <Button className='h-10 w-full rounded-full sm:w-auto'>Đăng xuất</Button>
                <Button
                  className='text-muted-foreground hover:text-foreground h-10 w-full rounded-full sm:w-auto'
                  variant='ghost'
                  onClick={() => setShowLogoutConfirm(false)}>
                  Để sau
                </Button>
              </div>
            </div>
          </CardSection>
        )}

        <CardSection className='border border-red-200/60 bg-red-50/60'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-foreground text-base font-semibold'>Xoá tài khoản</p>
              <p className='text-muted-foreground mt-1 text-xs leading-relaxed'>
                Toàn bộ dữ liệu sẽ bị xoá vĩnh viễn. Hãy cân nhắc kỹ.
              </p>
              <p className='text-muted-foreground mt-2 text-xs'>
                Bạn có muốn lưu lại nhật ký trước khi rời đi không?
              </p>
            </div>
            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-red-100'>
              <Trash2Icon className='h-4 w-4 text-red-600' />
            </div>
          </div>
          <Button
            className='mt-3 h-10 w-full rounded-full bg-red-500 text-white hover:bg-red-500/90'
            onClick={() => setShowDeleteConfirm(true)}>
            Xoá tài khoản
          </Button>
        </CardSection>

        {showDeleteConfirm && (
          <CardSection className='border border-red-200/60 bg-red-50/60'>
            <div className='flex flex-col gap-3'>
              <div>
                <p className='text-foreground text-sm font-semibold'>Xác nhận xoá tài khoản</p>
                <p className='text-muted-foreground mt-1 text-xs leading-relaxed'>
                  Nhập chữ “DELETE” để xác nhận.
                </p>
              </div>
              <Input
                className='rounded-2xl border border-black/5 bg-white px-4 py-2 text-sm'
                placeholder='DELETE'
                value={deleteText}
                onChange={(event) => setDeleteText(event.target.value)}
              />
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                <Button
                  className='h-10 w-full rounded-full bg-red-500 text-white hover:bg-red-500/90 sm:w-auto'
                  disabled={deleteText !== 'DELETE'}>
                  Xoá vĩnh viễn
                </Button>
                <Button
                  className='text-muted-foreground hover:text-foreground h-10 w-full rounded-full sm:w-auto'
                  variant='ghost'
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteText('')
                  }}>
                  Để sau
                </Button>
              </div>
            </div>
          </CardSection>
        )}
      </MainColumn>

      <SideColumn>
        <MiniCheckInCard />
        <DailyQuoteCard quote='“Mỗi việc thiện nhỏ đều gieo một hạt giống.”' />
        <WeeklyRhythmCard
          activeCount={4}
          description='4/7 ngày đã gieo hạt. Hãy giữ nhịp nhẹ nhàng.'
        />
      </SideColumn>
    </MainContainer>
  )
}

export default SettingsPage
