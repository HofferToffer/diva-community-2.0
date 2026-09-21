/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="sk" dir="ltr">
    <Head>
      <style>{darkModeCss}</style>
    </Head>
    <Preview>Dostali ste pozvánku do {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Dostali ste pozvánku</Heading>
        <Text style={text}>
          Boli ste pozvaní do{' '}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>
          . Kliknutím na tlačidlo nižšie pozvánku prijmete a vytvoríte si
          účet.
        </Text>
        <Button className="dm-btn" style={button} href={confirmationUrl}>
          Prijať pozvánku
        </Button>
        <Text style={footer}>
          Ak ste túto pozvánku nečakali, tento e-mail môžete pokojne
          ignorovať.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

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
const link = { color: 'inherit', textDecoration: 'underline' }
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
