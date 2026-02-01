import { PlusIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CardSection } from '@/components/shared/card-section'
import { Button } from '@/components/ui/button'

const journalEntries = [
  {
    id: 'j1',
    title: 'Biết ơn buổi sáng',
    snippet: 'Hôm nay mình nhận ra…',
    type: 'Biết ơn',
    date: '15/10/2026',
  },
  {
    id: 'j2',
    title: 'Một điều muốn buông',
    snippet: 'Mình chọn thở sâu và…',
    type: 'Sám hối',
    date: '12/10/2026',
  },
]

const InnerJournalPage = () => {
  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-4'>
      <CardSection as='header'>
        <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Sổ tay
        </p>
        <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight'>
          Sổ tay tâm hồn
        </h1>
        <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
          Ghi lại suy nghĩ để tâm mình nhẹ hơn.
        </p>
      </CardSection>

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-foreground text-base font-semibold'>Bài viết gần đây</p>
          <p className='text-muted-foreground mt-1 text-xs'>Chọn một bài để xem lại.</p>
        </div>
        <Button asChild className='h-10 rounded-full px-4 text-sm'>
          <Link to='/inner/journal/new'>
            <PlusIcon className='h-4 w-4' />
            Viết mới
          </Link>
        </Button>
      </div>

      <div className='flex flex-col gap-3'>
        {journalEntries.map((entry) => (
          <Link
            key={entry.id}
            className='flex flex-col gap-2 rounded-2xl border border-black/5 bg-white/80 p-4 transition-colors hover:bg-white'
            to={`/inner/journal/${entry.id}`}>
            <div className='flex items-center justify-between'>
              <p className='text-foreground text-sm font-semibold'>{entry.title}</p>
              <span className='text-muted-foreground text-xs'>{entry.date}</span>
            </div>
            <p className='text-muted-foreground text-xs'>{entry.snippet}</p>
            <span className='text-muted-foreground text-[11px]'>Loại: {entry.type}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default InnerJournalPage
