import type { IJointFrameProps } from "@/features/viewport/viewport.interface"

const bracket = "absolute size-3 border-primary"

// Computer-vision style detection box: corner brackets, faint outline, label tag.
export function JointFrame({ ref, label }: IJointFrameProps) {
  return (
    <div ref={ref} hidden className="pointer-events-none absolute top-0 left-0">
      <div className="absolute inset-0 border border-primary/40 bg-primary/5" />
      <span className={`${bracket} -top-px -left-px border-t-2 border-l-2`} />
      <span className={`${bracket} -top-px -right-px border-t-2 border-r-2`} />
      <span className={`${bracket} -bottom-px -left-px border-b-2 border-l-2`} />
      <span className={`${bracket} -right-px -bottom-px border-r-2 border-b-2`} />
      <span className="absolute bottom-full left-0 mb-1 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-primary-foreground tabular-nums">
        {label}
      </span>
    </div>
  )
}
