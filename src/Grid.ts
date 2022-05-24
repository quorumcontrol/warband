
import Cell from './Cell'
import { getRandomInteger } from './random'
import Warrior from './Warrior'

interface GridOptions {
  warriors: Warrior[]
}

class Grid {

  sizeX = 100
  sizeY = 100
  chanceOfSpawningWootGumpIn1000 = 1

  // 2x2 array of locations
  grid:Cell[][] = []
  
  constructor(opts:GridOptions) {
    this.initialCellPopulation(opts.warriors)
  }

  private initialCellPopulation(warriors:Warrior[]) {
    for (let y = 0; y < this.sizeY; y++) {
      for (let x = 0; x < this.sizeX; x++) {
        this.grid[x] = this.grid[x] || []
        this.grid[x][y] = new Cell({x, y, grid: this})
      }
    }
    warriors.forEach((warrior) => {
      this.grid[getRandomInteger(this.sizeX)][getRandomInteger(this.sizeY)].addWarrior(warrior)
    })
  }

}

export default Grid
