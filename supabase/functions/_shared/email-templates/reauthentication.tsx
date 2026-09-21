/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="sk" dir="ltr">
    <Head />
    <Preview>Váš overovací kód</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Potvrďte svoju totožnosť</Heading>
        <Text style={text}>Na potvrdenie identity použite kód nižšie:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          Platnosť kódu čoskoro vyprší. Ak ste oň nežiadali, tento e-mail
          môžete pokojne ignorovať.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#3a322c',
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  margin: '0 0 30px',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
