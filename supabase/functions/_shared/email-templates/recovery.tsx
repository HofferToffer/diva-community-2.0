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

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="sk" dir="ltr">
    <Head>
      <style>{darkModeCss}</style>
    </Head>
    <Preview>Obnovenie hesla pre {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Obnovenie hesla</Heading>
        <Text style={text}>
          Dostali sme žiadosť o obnovenie hesla pre {siteName}. Kliknutím na
          tlačidlo nižšie si nastavíte nové heslo.
        </Text>
        <Button className="dm-btn" style={button} href={confirmationUrl}>
          Obnoviť heslo
        </Button>
        <Text style={footer}>
          Ak ste o obnovenie hesla nežiadali, tento e-mail môžete pokojne
          ignorovať. Vaše heslo sa nezmení.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

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
