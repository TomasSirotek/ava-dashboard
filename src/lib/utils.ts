import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Base UI sliders report `number | number[]`; single-thumb sliders only care about the first value.
export const firstValue = (v: number | readonly number[]) => (Array.isArray(v) ? v[0] : (v as number))
