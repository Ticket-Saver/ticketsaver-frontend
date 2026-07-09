interface TagListProps {
  tags: string[]
}

export default function TagList({ tags }: TagListProps) {
  if (tags.length === 0) return null
  return (
    <div className='flex flex-wrap gap-1.5'>
      {tags.map((tag) => (
        <span
          key={tag}
          className='inline-flex items-center px-2.5 py-1 rounded-pill bg-white/[0.05] border border-white/[0.12] text-white/80 text-[10.5px] font-medium font-display tracking-[0.02em]'
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
