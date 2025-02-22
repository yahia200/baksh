import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Game } from "@/types/index"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const checkGame = (game: Game) => {
  for (let i = 0; i < game.operations.length; i++) {
    const split = game.operations[i].description.split(' ');
    if (split.includes('sabooba'))
      game.operations[i].name = 'Sabooba';
    else if (split.includes('maalooma'))
      game.operations[i].name = 'Maalooma';
    else if (split.includes('shoraka'))
      game.operations[i].name = 'Shoraka';
    else if (split.includes('t3trflo'))
      game.operations[i].name = 'E3trf';
  }
  return game;
}