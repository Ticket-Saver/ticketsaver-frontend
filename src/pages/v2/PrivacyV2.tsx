import LegalShell from '../../components/v2/legal/LegalShell'
import type { LegalSectionData } from '../../components/v2/legal/LegalSection'

const SECTIONS: LegalSectionData[] = [
  {
    id: 'collect',
    title: 'Information we collect',
    body: 'When you use our website or services, we may collect personal information to facilitate ticket purchases and provide support.',
    bullets: [
      'Personal: name, email, phone number, and payment details.',
      'Non-personal: device info, IP address and browsing behavior for analytics.'
    ]
  },
  {
    id: 'use',
    title: 'How we use your information',
    body: 'Your personal information is used to process ticket orders, communicate about your purchases, provide support and send relevant updates.\n\nNon-personal information is used for analytics to improve our website, services and marketing.'
  },
  {
    id: 'protection',
    title: 'Data protection',
    body: 'We implement industry-standard security measures to protect your data from unauthorized access, disclosure, alteration or destruction. Your information is stored securely and accessed only by authorized personnel for legitimate business purposes.'
  },
  {
    id: 'disclosure',
    title: 'Data disclosure',
    body: 'We may disclose your information to trusted third-party providers who help us deliver services, process payments or analyze performance. They are bound by confidentiality agreements.\n\nWe will not sell, rent or lease your personal information to third parties for marketing without your consent.'
  },
  {
    id: 'compliance',
    title: 'Privacy compliance',
    body: 'Our practices are designed to comply with applicable privacy laws, including GDPR and CCPA. By using our website and services, you consent to the collection, use and disclosure of your information as described here.'
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: 'If you have any questions, concerns or requests regarding your data privacy, contact us at support@ticketsaver.net.'
  }
]

export default function PrivacyV2() {
  return (
    <LegalShell
      context='privacy'
      eyebrow='Legal'
      title='Privacy Policy'
      updated='May 2026'
      intro='We collect only what we need to sell you tickets and support you, protect it with industry-standard security, never sell it for marketing, and comply with GDPR and CCPA.'
      sections={SECTIONS}
      meshSeed={9}
    />
  )
}
