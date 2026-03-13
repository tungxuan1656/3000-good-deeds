import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { getCategories } from '../../api/categories'
import { t } from '../../lib/i18n'
import type { DeedCategoryDTO } from '../../types/api'

const ONE_DAY = 1000 * 60 * 60 * 24

export const CATEGORY_KEYS = {
  all: ['categories'] as const,
}

// Language-change in this app triggers a full page reload, so module-level t() calls are safe.
const FALLBACK_CATEGORIES: DeedCategoryDTO[] = [
  {
    code: 'body',
    name: t('categories.fallback.body.name'),
    description: t('categories.fallback.body.description'),
    style: 'bg-body/20 hover:bg-body/40',
    icon: '/icons/icon_than.png',
  },
  {
    code: 'speech',
    name: t('categories.fallback.speech.name'),
    description: t('categories.fallback.speech.description'),
    style: 'bg-speech/20 hover:bg-speech/40',
    icon: '/icons/icon_khau.png',
  },
  {
    code: 'mind',
    name: t('categories.fallback.mind.name'),
    description: t('categories.fallback.mind.description'),
    style: 'bg-mind/20 hover:bg-mind/40',
    icon: '/icons/icon_y.png',
  },
]

export const useCategories = () => {
  const query = useQuery({
    queryKey: CATEGORY_KEYS.all,
    queryFn: getCategories,
    staleTime: ONE_DAY,
    gcTime: ONE_DAY,
    select: (response) => response.data,
  })

  const output = useMemo(() => {
    const data = query.data ?? FALLBACK_CATEGORIES
    const codeToCategoryMap: Record<string, DeedCategoryDTO> = {}

    data.forEach((category) => {
      codeToCategoryMap[category.code] = category
    })

    return { ...query, data, codeToCategoryMap }
  }, [query.data])

  return output
}
