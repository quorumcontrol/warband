import { randomInt } from 'crypto'

export function getRandomInteger(max: number) {
  return randomInt(max)
}
