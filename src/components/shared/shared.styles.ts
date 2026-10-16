// Secondary action button: thin outline on the panel background, used next to headings and for minor actions.
export const secondaryButton = "border-border bg-transparent text-foreground hover:bg-accent hover:text-foreground"

// Left and right side panels share one width so the 3D view sits centred between equal columns.
export const sidePanel = "w-80 shrink-0"

// Side panel body: one flat column whose sections are separated by hairlines (left telemetry and right tabs).
// Every section gets the same padding.
export const panelStack = "flex flex-col divide-y *:p-4"

// Type scale used by both side panels, all Poppins; numbers add `tabular-nums` so digits don't jitter.
// capsLabel: section headings, field captions (ID, Model), status cells, tabs. Item names (Shoulder pan,
// Velocity scale) are text-sm font-medium like the form Label; helper text is text-xs text-muted-foreground.
export const capsLabel = "font-sans text-[11px] font-medium tracking-wider uppercase"

// One cell of a joined group (status block, header strip): caps label, no border of its own;
// the group draws the outline and the dividing lines.
export const statusCell = "flex h-9 items-center justify-center gap-2 px-3 text-[11px] font-medium tracking-[0.08em] uppercase"

// A joined group of cells: outline plus hairlines between the cells.
export const cellGroup = "flex divide-x overflow-hidden rounded-sm border"
