import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Game } from "@/types/index"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const checkGame = (game: Game) => {
  let ops = game.operations;
  for (let i = 0; i < ops.length; i++) {
    const split = ops[i].description.split(' ');
    if (split.includes('sabooba'))
      ops[i].name = 'Sabooba';
    else if (split.includes('maalooma'))
      ops[i].name = 'Maalooma';
    else if (split.includes('shoraka'))
      ops[i].name = 'Shoraka';
    else if (split.includes('t3trflo'))
      ops[i].name = 'E3trf';
  }
  return {...game, operations: ops};
}