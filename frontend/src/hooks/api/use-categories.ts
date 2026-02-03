import { useQuery } from '@tanstack/react-query'

import { getCategories } from '../../api/categories'
import type { DeedCategoryDTO } from '../../types/api'

const ONE_DAY = 1000 * 60 * 60 * 24

export const CATEGORY_KEYS = {
  all: ['categories'] as const,
}

const FALLBACK_CATEGORIES: DeedCategoryDTO[] = [
  {
    code: 'body',
    name: 'Thân thiện',
    description: 'Hành động cụ thể bằng thân',
    style: 'bg-body/20 hover:bg-body/40',
    icon: '/icons/icon_than.png',
  },
  {
    code: 'speech',
    name: 'Khẩu thiện',
    description: 'Lời nói ái ngữ, chân thật',
    style: 'bg-speech/20 hover:bg-speech/40',
    icon: '/icons/icon_khau.png',
  },
  {
    code: 'mind',
    name: 'Ý thiện',
    description: 'Suy nghĩ lành, buông xả',
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

  return {
    ...query,
    data: query.data ?? FALLBACK_CATEGORIES,
  }
}
