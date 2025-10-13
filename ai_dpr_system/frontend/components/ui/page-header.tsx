import React from 'react'

interface PageHeaderProps {
  heading: string
  subheading?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({ heading, subheading, icon, actions }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start pb-6 border-b border-gray-200 dark:border-gray-700">
      <div className="space-y-1 flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-primary/10 rounded-md text-primary">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
          {subheading && (
            <p className="text-muted-foreground">{subheading}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}