import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { t } from '@/lib/i18n'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'

const breadcrumbLabels: Record<string, string> = {
  timeline: t('breadcrumbs.timeline'),
  deeds: t('breadcrumbs.deeds'),
  stats: t('breadcrumbs.stats'),
  goals: t('breadcrumbs.goals'),
  inner: t('breadcrumbs.inner'),
  more: t('breadcrumbs.more'),
  quote: t('breadcrumbs.quote'),
  'random-acts': t('breadcrumbs.randomActs'),
  journal: t('breadcrumbs.journal'),
  settings: t('breadcrumbs.settings'),
  history: t('breadcrumbs.history'),
}

export const HeaderBreadcrumbs = () => {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  const breadcrumbs = [{ label: t('breadcrumbs.home'), path: '/' }]
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
            <React.Fragment key={crumb.path}>
              {index > 0 && <BreadcrumbSeparator className='text-muted-foreground/50' />}
              <BreadcrumbItem key={crumb.path}>
                {isLast ? (
                  <BreadcrumbPage className='font-medium'>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className='font-medium'>
                    <Link to={crumb.path}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
