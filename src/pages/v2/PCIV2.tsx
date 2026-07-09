import LegalShell from '../../components/v2/legal/LegalShell'
import type { LegalSectionData } from '../../components/v2/legal/LegalSection'

const SECTIONS: LegalSectionData[] = [
  {
    id: 'commitment',
    title: 'Our commitment',
    body: 'At TicketSaver, we take the security of your payment information very seriously. We are committed to maintaining Payment Card Industry Data Security Standard (PCI DSS) compliance to protect your sensitive data.\n\nOur payment processing is designed to adhere to the highest standards of security to safeguard your personal and financial information.'
  },
  {
    id: 'measures',
    title: 'Security measures',
    body: 'Here are some of the measures we have in place to maintain PCI compliance:',
    bullets: [
      'SSL encryption protects data in transit between your browser and our servers.',
      'Tokenization replaces sensitive card data with unique identifiers, reducing exposure.',
      'Access control restricts cardholder data to authorized personnel with strong authentication.',
      'Card data never touches our servers — Stripe handles the vault.'
    ]
  },
  {
    id: 'reliability',
    title: 'A reliable platform',
    body: 'By complying with PCI DSS requirements, TicketSaver aims to provide you with a secure and reliable platform for purchasing tickets online. If you have any questions or concerns about our security measures, contact us at support@ticketsaver.net.'
  }
]

export default function PCIV2() {
  return (
    <LegalShell
      context='pci'
      eyebrow='Legal'
      title='PCI Compliance'
      updated='May 2026'
      readTime='2 min read'
      intro='We are PCI DSS compliant. Your card never touches our servers — Stripe handles it with SSL encryption, tokenization and strict access control.'
      sections={SECTIONS}
      meshSeed={9}
    />
  )
}
