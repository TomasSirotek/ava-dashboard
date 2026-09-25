import type { IJointFrameProps } from "@/features/viewport/viewport.interface"

const bracket = "absolute size-3 border-orange-500"

// Computer-vision style detection box: corner brackets, faint outline, label tag.
export function JointFrame({ ref, label }: IJointFrameProps) {
  return (
    <div ref={ref} hidden className="pointer-events-none absolute top-0 left-0">
      <div className="absolute inset-0 border border-orange-500/40 bg-orange-500/5" />
      <span className={`${bracket} -top-px -left-px border-t-2 border-l-2`} />
      <span className={`${bracket} -top-px -right-px border-t-2 border-r-2`} />
      <span className={`${bracket} -bottom-px -left-px border-b-2 border-l-2`} />
      <span className={`${bracket} -right-px -bottom-px border-r-2 border-b-2`} />
      <span className="absolute bottom-full left-0 mb-1 rounded-sm bg-orange-500 px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-white tabular-nums">
        {label}
      </span>
    </div>
  )
}
