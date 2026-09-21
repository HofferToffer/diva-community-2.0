import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { sendLovableEmail, EmailAPIError } from 'npm:@lovable.dev/email-js@0.1.0'
import { TEMPLATES } from './registry.ts'

// Managed transactional sending through Lovable's email API.
// Renders a registered template and sends it to its fixed recipient (`to`).

const SITE_NAME = 'Diva Community'
const FROM_DOMAIN = 'divacommunity.sk'

export async function sendTransactionalTemplate(
  templateName: string,
  templateData: Record<string, unknown>,
  idempotencyKey: string,
): Promise<void> {
  const entry = TEMPLATES[templateName]
  if (!entry) throw new Error(`Unknown template: ${templateName}`)
  if (!entry.to) throw new Error(`Template ${templateName} has no fixed recipient`)

  const apiKey = Deno.env.get('LOVABLE_API_KEY')
  if (!apiKey) throw new Error('LOVABLE_API_KEY not configured')

  const element = React.createElement(entry.component, templateData)
  const html = await renderAsync(element)
  const text = await renderAsync(element, { plainText: true })
  const subject =
    typeof entry.subject === 'function' ? entry.subject(templateData) : entry.subject

  try {
    await sendLovableEmail(
      {
        to: entry.to,
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        subject,
        html,
        text,
        purpose: 'transactional',
        label: templateName,
        idempotency_key: idempotencyKey,
      },
      { apiKey, idempotencyKey },
    )
  } catch (err) {
    if (err instanceof EmailAPIError && err.status === 429) {
      const wait = err.retryAfterSeconds ?? 60
      console.warn(`[email] rate limited, retry after ${wait}s`)
      await new Promise((resolve) => setTimeout(resolve, wait * 1000))
      await sendLovableEmail(
        {
          to: entry.to!,
          from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
          subject,
          html,
          text,
          purpose: 'transactional',
          label: templateName,
          idempotency_key: idempotencyKey,
        },
        { apiKey, idempotencyKey },
      )
      return
    }
    throw err
  }
}
