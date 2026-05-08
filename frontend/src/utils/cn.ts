import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge tailwind classnames intelligently. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
