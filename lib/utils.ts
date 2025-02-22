import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Operation } from "@/types/index"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const checkOpName = (op: Operation) => {
  const split = op.description.split(' ');
  if (split.includes('t3trflo')) return 'E3trf';
  if (split.includes('sabooba')) return 'Sabooba';
  if (split.includes('maalooma')) return 'Maalooma';
  if (split.includes('shoraka')) return 'Shoraka';
  return '';
}