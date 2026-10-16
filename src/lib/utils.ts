import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Base UI sliders report `number | number[]`; single-thumb sliders only care about the first value.
export const firstValue = (v: number | readonly number[]) => (Array.isArray(v) ? v[0] : (v as number))

// 24-hour HH:MM:SS in the browser's time zone, used by the header clock and the system log.
export const clockTime = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
