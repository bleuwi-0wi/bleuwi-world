export default function BrandMark({ size = 'default' }) {
  const sizing = size === 'small' ? 'h-8 w-8 text-sm' : 'h-14 w-14 text-xl'

  return (
    <span className={`brand-mark ${sizing}`} aria-hidden="true">
      B
    </span>
  )
}
