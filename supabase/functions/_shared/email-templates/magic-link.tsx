/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="sk" dir="ltr">
    <Head>
      <style>{darkModeCss}</style>
    </Head>
    <Preview>Váš prihlasovací odkaz pre {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Váš prihlasovací odkaz</Heading>
        <Text style={text}>
          Kliknutím na tlačidlo nižšie sa prihlásite do {siteName}. Platnosť
          odkazu čoskoro vyprší.
        </Text>
        <Button className="dm-btn" style={button} href={confirmationUrl}>
          Prihlásiť sa
        </Button>
        <Text style={footer}>
          Ak ste o tento odkaz nežiadali, tento e-mail môžete pokojne
          ignorovať.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Josefin Sans', Arial, sans-serif" }
const container = { padding: '20px 25px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#3a322c',
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#55575d',
  lineHeight: '1.5',
  margin: '0 0 25px',
}
const button = {
  backgroundColor: '#697440',
  color: '#ffffff',
  fontSize: '14px',
  border: '1px solid #697440',
  borderRadius: '4px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
// Rendered as a text child, which React may HTML-escape: keep this CSS free of >, &, and quotes.
const darkModeCss = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  }
  [data-ogsc] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
  [data-ogsb] .dm-btn { background-color: #ffffff !important; color: #000000 !important; }
`
