// Secondary action button: thin outline on the panel background, used next to headings and for minor actions.
export const secondaryButton = "border-border bg-transparent text-foreground hover:bg-accent hover:text-foreground"

// Selected / main action drawn inverted (foreground fill): white on dark, near-black on light. Used by the control
// mode chip and the Connect button; the joint pills and segmented tabs repeat it as aria-pressed: / data-active: variants.
// `!` beats the Button variant's own bg/text (incl. its dark: variants).
export const invertedFill = "bg-foreground! text-background! hover:bg-foreground/90! rounded-none"

// Right column body: one flat column whose sections are separated by hairlines (controls tabs, details).
// Every section gets the same padding.
export const panelStack = "flex flex-col divide-y *:p-4"

// Type scale, all Poppins; numbers add `tabular-nums` so digits don't jitter.
// capsLabel: section headings, table headers, field captions, tabs. Item names (Shoulder pan,
// Velocity scale) are text-sm font-medium like the form Label; helper text is text-xs text-muted-foreground.
export const capsLabel = "font-sans text-[11px] font-medium tracking-wider uppercase"

// A joined group of cells (header clock): outline plus hairlines between the cells.
export const cellGroup = "flex divide-x overflow-hidden rounded-sm border"
