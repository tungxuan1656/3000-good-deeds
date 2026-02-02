import { Link, useLocation } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'

const breadcrumbLabels: Record<string, string> = {
  timeline: 'Hành trình',
  deeds: 'Việc thiện',
  achievements: 'Thành tựu',
  stats: 'Thống kê',
  goals: 'Mục tiêu',
  inner: 'Nội tâm',
  quote: 'Trích dẫn',
  'random-acts': 'Gợi ý',
  journal: 'Nhật ký',
  meditation: 'Thiền',
  settings: 'Cài đặt',
}

export const HeaderBreadcrumbs = () => {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  const breadcrumbs = [{ label: 'Trang chủ', path: '/' }]
  let currentPath = ''

  for (const segment of segments) {
    currentPath += `/${segment}`

    breadcrumbs.push({
      label: breadcrumbLabels[segment] ?? decodeURIComponent(segment),
      path: currentPath,
    })
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className='text-sm md:text-base'>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <BreadcrumbItem key={crumb.path}>
              {index > 0 && <BreadcrumbSeparator className='text-muted-foreground/50' />}
              {isLast ? (
                <BreadcrumbPage className='font-medium'>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild className='font-medium'>
                  <Link to={crumb.path}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
