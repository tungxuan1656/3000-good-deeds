import { Link } from 'react-router-dom'

import { PATHS } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth-store'

import { Button } from '../ui/button'
import { CardSection } from './card-section'

export const ReminderSuggestCard = () => {
  const enable = useAuthStore.use.user()?.reminderEnabled
  if (enable) {
    return null
  }

  return (
    <CardSection padding='md'>
      <h3 className='text-foreground text-base font-semibold'>Nhắc nhở dịu nhẹ</h3>
      <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
        “Một điều tử tế mỗi ngày, tâm an yên hơn mỗi tối.”
      </p>
      <Link to={PATHS.SETTINGS}>
        <Button className='text-foreground mt-4 h-11 w-full rounded-full border border-black/5 bg-white text-sm font-medium hover:bg-white/80'>
          Thiết lập nhắc nhở
        </Button>
      </Link>
    </CardSection>
  )
}
