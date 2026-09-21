import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import {
  createAuthEmailHandler,
  type AuthEmailHookData,
} from 'npm:@lovable.dev/email-js@0.1.0'
import { SignupEmail } from '../_shared/email-templates/signup.tsx'
import { InviteEmail } from '../_shared/email-templates/invite.tsx'
import { MagicLinkEmail } from '../_shared/email-templates/magic-link.tsx'
import { RecoveryEmail } from '../_shared/email-templates/recovery.tsx'
import { EmailChangeEmail } from '../_shared/email-templates/email-change.tsx'
import { ReauthenticationEmail } from '../_shared/email-templates/reauthentication.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-lovable-signature, x-lovable-timestamp, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const EMAIL_SUBJECTS = {
  signup: 'Potvrďte svoj e-mail',
  invite: 'Dostali ste pozvánku',
  magiclink: 'Váš prihlasovací odkaz',
  recovery: 'Obnovenie hesla',
  email_change: 'Potvrďte svoj nový e-mail',
  reauthentication: 'Váš overovací kód',
} as const

// Configuration
const SITE_NAME = "Diva Community"
const ROOT_DOMAIN = "divacommunity.sk"
const FROM_DOMAIN = "divacommunity.sk" // Domain shown in From address (may be root or sender subdomain)

// Map the auth webhook payload onto the props the templates expect.
const buildProps = (data: AuthEmailHookData) => ({
  siteName: SITE_NAME,
  siteUrl: `https://${ROOT_DOMAIN}`,
  recipient: data.email,
  confirmationUrl: data.url,
  token: data.token,
  email: data.email,
  oldEmail: data.old_email,
  newEmail: data.new_email,
})

const handler = createAuthEmailHandler({
  apiKey: Deno.env.get('LOVABLE_API_KEY') ?? '',
  from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
  emails: {
    signup: { subject: EMAIL_SUBJECTS.signup, render: (d) => React.createElement(SignupEmail, buildProps(d)) },
    invite: { subject: EMAIL_SUBJECTS.invite, render: (d) => React.createElement(InviteEmail, buildProps(d)) },
    magiclink: { subject: EMAIL_SUBJECTS.magiclink, render: (d) => React.createElement(MagicLinkEmail, buildProps(d)) },
    recovery: { subject: EMAIL_SUBJECTS.recovery, render: (d) => React.createElement(RecoveryEmail, buildProps(d)) },
    email_change: { subject: EMAIL_SUBJECTS.email_change, render: (d) => React.createElement(EmailChangeEmail, buildProps(d)) },
    reauthentication: { subject: EMAIL_SUBJECTS.reauthentication, render: (d) => React.createElement(ReauthenticationEmail, buildProps(d)) },
  },
})

// Template mapping for preview mode
const EMAIL_TEMPLATES: Record<string, React.ComponentType<any>> = {
  signup: SignupEmail,
  invite: InviteEmail,
  magiclink: MagicLinkEmail,
  recovery: RecoveryEmail,
  email_change: EmailChangeEmail,
  reauthentication: ReauthenticationEmail,
}

// Sample data for preview mode ONLY (not used in actual email sending).
// URLs are baked in at scaffold time from the project's real data.
// The sample email uses a fixed placeholder (RFC 6761 .test TLD) so the Go backend
// can always find-and-replace it with the actual recipient when sending test emails,
// even if the project's domain has changed since the template was scaffolded.
const SAMPLE_PROJECT_URL = "https://diva-sparkle-community.lovable.app"
const SAMPLE_EMAIL = "user@example.test"
const SAMPLE_DATA: Record<string, object> = {
  signup: {
    siteName: SITE_NAME,
    siteUrl: SAMPLE_PROJECT_URL,
    recipient: SAMPLE_EMAIL,
    confirmationUrl: `${SAMPLE_PROJECT_URL}/auth/confirm?token=sample-token-123`,
    token: "123456",
  },
  recovery: {
    siteName: SITE_NAME,
    siteUrl: SAMPLE_PROJECT_URL,
    recipient: SAMPLE_EMAIL,
    confirmationUrl: `${SAMPLE_PROJECT_URL}/auth/confirm?token=sample-token-123`,
    token: "123456",
  },
  magiclink: {
    siteName: SITE_NAME,
    siteUrl: SAMPLE_PROJECT_URL,
    recipient: SAMPLE_EMAIL,
    confirmationUrl: `${SAMPLE_PROJECT_URL}/auth/confirm?token=sample-token-123`,
    token: "123456",
  },
  invite: {
    siteName: SITE_NAME,
    siteUrl: SAMPLE_PROJECT_URL,
    recipient: SAMPLE_EMAIL,
    confirmationUrl: `${SAMPLE_PROJECT_URL}/auth/confirm?token=sample-token-123`,
    token: "123456",
  },
  email_change: {
    siteName: SITE_NAME,
    siteUrl: SAMPLE_PROJECT_URL,
    recipient: SAMPLE_EMAIL,
    confirmationUrl: `${SAMPLE_PROJECT_URL}/auth/confirm?token=sample-token-123`,
    token: "123456",
    email: SAMPLE_EMAIL,
    oldEmail: SAMPLE_EMAIL,
    newEmail: SAMPLE_EMAIL,
  },
  reauthentication: {
    siteName: SITE_NAME,
    siteUrl: SAMPLE_PROJECT_URL,
    recipient: SAMPLE_EMAIL,
    confirmationUrl: `${SAMPLE_PROJECT_URL}/auth/confirm?token=sample-token-123`,
    token: "123456",
    email: SAMPLE_EMAIL,
  },
}

// Preview handler - returns rendered HTML for template previews in the UI
async function handlePreview(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const type = url.searchParams.get('type')

  const previewCorsHeaders = {
    ...corsHeaders,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  }

  if (!type || !EMAIL_TEMPLATES[type]) {
    return new Response(
      JSON.stringify({
        error: `Unknown email type: ${type}. Available: ${Object.keys(EMAIL_TEMPLATES).join(', ')}`,
      }),
      { status: 400, headers: { ...previewCorsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const EmailTemplate = EMAIL_TEMPLATES[type]
  const sampleData = SAMPLE_DATA[type] || {}
  const html = await renderAsync(React.createElement(EmailTemplate, sampleData))

  return new Response(html, {
    status: 200,
    headers: { ...previewCorsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
  })
}

Deno.serve(async (req) => {
  const url = new URL(req.url)

  // Handle CORS preflight for main endpoint
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Route to preview handler for /preview path
  if (url.pathname.endsWith('/preview')) {
    return handlePreview(req)
  }

  // Main webhook handler (managed sending via Lovable email API)
  return handler(req)
})
