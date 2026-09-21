import type { ComponentType } from 'npm:react@18.3.1'
import { template as orderNotification } from './order-notification.tsx'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  // Fixed recipient for notification templates (e.g. site owner).
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'order-notification': orderNotification,
}
