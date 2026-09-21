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

import type { TemplateEntry } from './registry.ts'

interface OrderItem {
  priceId: string
  name: string
  quantity: number
  unit_amount_cents: number
}

interface OrderNotificationProps {
  orderId?: string
  customerName?: string
  email?: string
  phone?: string
  items?: OrderItem[]
  totalCents?: number
  paymentMethod?: string
  deliveryMethod?: string
}

const formatEur = (cents: number) => `${(cents / 100).toFixed(2).replace('.', ',')} €`

export const OrderNotificationEmail = ({
  orderId = '',
  customerName = '',
  email = '',
  phone = '',
  items = [],
  totalCents = 0,
  paymentMethod = 'hotovost',
  deliveryMethod = 'osobny_odber',
}: OrderNotificationProps) => (
  <Html lang="sk" dir="ltr">
    <Head />
    <Preview>Nová objednávka od {customerName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Nová objednávka</Heading>
        <Text style={text}>
          <strong>Zákazníčka:</strong> {customerName}
          <br />
          <strong>E-mail:</strong> {email}
          <br />
          <strong>Telefón:</strong> {phone || '—'}
          <br />
          <strong>Platba:</strong> {paymentMethod === 'hotovost' ? 'Hotovosť' : paymentMethod}
          <br />
          <strong>Doručenie:</strong>{' '}
          {deliveryMethod === 'osobny_odber' ? 'Osobný odber' : deliveryMethod}
        </Text>
        <Text style={subtitle}>Položky</Text>
        {items.map((item) => (
          <Text key={item.priceId} style={itemRow}>
            {item.name} × {item.quantity} — {formatEur(item.unit_amount_cents * item.quantity)}
          </Text>
        ))}
        <Text style={total}>Spolu: {formatEur(totalCents)}</Text>
        <Text style={footer}>ID objednávky: {orderId}</Text>
      </Container>
    </Body>
  </Html>
)

export default OrderNotificationEmail

export const template = {
  component: OrderNotificationEmail,
  subject: (data: Record<string, any>) =>
    `Nová objednávka – ${data.customerName || 'Diva Community'}`,
  displayName: 'Notifikácia novej objednávky',
  to: 'didka0105@gmail.com',
  previewData: {
    orderId: '00000000-0000-0000-0000-000000000000',
    customerName: 'Jana Nováková',
    email: 'jana@example.com',
    phone: '+421 900 000 000',
    items: [
      { priceId: 'cap_pink', name: 'DIVA Šiltovka – Ružová', quantity: 1, unit_amount_cents: 1490 },
    ],
    totalCents: 1490,
    paymentMethod: 'hotovost',
    deliveryMethod: 'osobny_odber',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Josefin Sans', Arial, sans-serif" }
const container = { padding: '20px 25px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#3a322c',
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  margin: '0 0 20px',
}
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.6', margin: '0 0 25px' }
const subtitle = {
  fontSize: '12px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  color: '#7d7266',
  margin: '0 0 10px',
}
const itemRow = { fontSize: '14px', color: '#3a322c', margin: '0 0 6px' }
const total = {
  fontSize: '15px',
  fontWeight: 'bold' as const,
  color: '#3a322c',
  margin: '15px 0 0',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
