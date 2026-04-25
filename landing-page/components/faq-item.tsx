type FaqItemProps = {
  question: string
  answer: string
}

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <article className='rounded-2xl border border-slate-200 bg-white p-6'>
      <h3 className='text-lg font-semibold tracking-tight text-slate-900'>
        {question}
      </h3>
      <p className='mt-2 text-base leading-7 text-slate-700'>{answer}</p>
    </article>
  )
}

