import { useState, useEffect } from 'react'
import { cn } from '../../../types/ui'
import {
  recordFeedback,
  getFeedbackFor,
  type FeedbackVote
} from '../../../services/feedbackService'

interface MiniSurveyProps {
  context: string
  sectionId: string
  question?: string
  positiveLabel?: string
  negativeLabel?: string
  positiveVote?: FeedbackVote
  negativeVote?: FeedbackVote
}

export default function MiniSurvey({
  context,
  sectionId,
  question = 'Was this section clear?',
  positiveLabel = 'Yes',
  negativeLabel = 'Confusing',
  positiveVote = 'clear',
  negativeVote = 'confusing'
}: MiniSurveyProps) {
  const [vote, setVote] = useState<FeedbackVote | null>(null)

  useEffect(() => {
    setVote(getFeedbackFor(context, sectionId))
  }, [context, sectionId])

  const cast = (v: FeedbackVote) => {
    setVote(v)
    recordFeedback(context, sectionId, v)
  }

  if (vote) {
    return (
      <div className='mt-4 rounded-glass-sm bg-white/[0.04] border border-white/[0.10] px-3 py-2.5 text-[11.5px] text-white/65'>
        Thanks for the feedback — it helps us write clearer docs.
      </div>
    )
  }

  return (
    <div className='mt-4 rounded-glass-sm bg-white/[0.04] border border-white/[0.10] px-3 py-2.5 flex items-center gap-2.5'>
      <span className='flex-1 text-[11.5px] text-white/55'>{question}</span>
      <SurveyBtn onClick={() => cast(positiveVote)}>{positiveLabel}</SurveyBtn>
      <SurveyBtn onClick={() => cast(negativeVote)}>{negativeLabel}</SurveyBtn>
    </div>
  )
}

const SurveyBtn = ({ onClick, children }: { onClick: () => void; children: string }) => (
  <button
    type='button'
    onClick={onClick}
    className={cn(
      'rounded-pill px-3 py-1 text-[10.5px] font-display font-semibold',
      'bg-white/[0.06] border border-white/10 text-white hover:bg-white/[0.12] transition'
    )}
  >
    {children}
  </button>
)
