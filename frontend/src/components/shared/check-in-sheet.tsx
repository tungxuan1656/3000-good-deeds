import * as React from 'react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCategories } from '@/hooks/api/use-categories'
import { useCreateDeed } from '@/hooks/api/use-deeds'
import { useIsMobile } from '@/hooks/shared/use-mobile'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'

import { CheckInSheetFlow } from './check-in-sheet-flow'
import { CheckInSheetTip } from './check-in-sheet-tip'
import { GoodDeedCategoryButton } from './good-deed-category-button'
import { InfoButton } from './info-button'

export interface CheckInDrawerHandle {
  open: (categoryCode?: string) => void
  close: () => void
}

export const CheckInSheet = React.forwardRef<CheckInDrawerHandle>((_props, ref) => {
  const isMobile = useIsMobile()
  const { data: categories } = useCategories()
  const createDeed = useCreateDeed()

  const [isOpen, setIsOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [category, setCategory] = React.useState<string | null>(null)
  const [resetSeed, setResetSeed] = React.useState(0)

  const open = React.useCallback((categoryCode?: string) => {
    setCategory(categoryCode ?? null)
    setStep(categoryCode ? 2 : 1)
    setResetSeed((prev) => prev + 1)
    setIsOpen(true)
  }, [])

  const close = React.useCallback(() => setIsOpen(false), [])

  React.useImperativeHandle(ref, () => ({ open, close }), [open, close])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        className={isMobile ? 'rounded-t-2xl' : ''}
        side={isMobile ? 'bottom' : 'right'}>
        <SheetHeader>
          <div className='flex items-center gap-1 pr-4'>
            <SheetTitle>{t('checkIn.sheet.title')}</SheetTitle>
            <InfoButton description={INFO_COPY.deeds.description} title={INFO_COPY.deeds.title} />
          </div>
          <SheetDescription>
            {step === 1 && t('checkIn.sheet.stepDescription.1')}
            {step === 2 && t('checkIn.sheet.stepDescription.2')}
            {step === 3 && t('checkIn.sheet.stepDescription.3')}
          </SheetDescription>
        </SheetHeader>
        {step === 1 && (
          <div className='px-4 pb-4'>
            <div className='flex flex-col gap-3'>
              {categories.map((item) => (
                <GoodDeedCategoryButton
                  key={item.code}
                  category={item}
                  onClick={() => {
                    setCategory(item.code)
                    setStep(2)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <CheckInSheetFlow
          category={category}
          createDeed={createDeed}
          onClose={close}
          resetSeed={resetSeed}
          setStep={setStep}
          step={step}
        />

        <div className='px-4 pb-4'>
          <CheckInSheetTip />
        </div>
      </SheetContent>
    </Sheet>
  )
})
