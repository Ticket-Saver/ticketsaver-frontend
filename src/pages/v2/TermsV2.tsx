import LegalShell from '../../components/v2/legal/LegalShell'
import type { LegalSectionData } from '../../components/v2/legal/LegalSection'

const SECTIONS: LegalSectionData[] = [
  {
    id: 'purchases',
    title: 'Purchases & sales',
    body: 'Please review your purchase before proceeding. All sales are final. No refunds will be granted under any circumstance unless the event is postponed or rescheduled, which opens a window for refunds.\n\nAll tickets are issued to the account used at checkout and appear instantly in "My tickets" and in your wallet as an NFT. Please also check your spam folder for confirmation emails.'
  },
  {
    id: 'refunds',
    title: 'Refunds & rescheduling',
    body: 'In the case of cancellation of the event, all tickets will be reimbursed unless the cancellation falls under force majeure events outside the control of anyone.\n\nIf an event is rescheduled or postponed, patrons may request a refund or choose to keep their ticket for the new date.',
    bullets: [
      'Cancelled event → 100% refund to the original payment method within 7 days.',
      'Rescheduled event → keep your ticket or request a refund.',
      'Change of mind → platform credit within the first 48 hours.'
    ]
  },
  {
    id: 'transfers',
    title: 'Transfers & resale',
    body: 'Unlawful sale or attempted sale is prohibited. Resale is only allowed through TicketSaver at face value or below. Tickets sold outside the platform may be invalidated.\n\nWhen you resell through us, the NFT is transferred to the buyer and your refund is issued instantly.'
  },
  {
    id: 'liability',
    title: 'Liability',
    body: 'The holder assumes all risks occurring before, during, or after the event, including injury by any cause, and releases Ticket Saver LLC and its representatives from any claims.\n\nTicket Saver LLC only provides the system that enables ticket sales for the event. It is not responsible for the organization of the events themselves.'
  },
  {
    id: 'account',
    title: 'Account & fraud',
    body: 'Disputes will not be tolerated. Your account is verified with your email to avoid fraud-related activity. We may suspend accounts engaged in chargeback abuse, bot activity, or unauthorized resale.'
  }
]

export default function TermsV2() {
  return (
    <LegalShell
      context='terms'
      eyebrow='Legal'
      title='Terms & Conditions'
      updated='May 2026'
      intro='All sales are final unless an event is cancelled or rescheduled. Tickets live in your wallet as NFTs, can only be resold at face value through us, and you assume normal event-going risks. We just provide the ticketing rails.'
      sections={SECTIONS}
      meshSeed={7}
    />
  )
}
