import Grid from "./Grid"
import Warrior from "./Warrior"

interface CellInitializeOptions {
  x:number
  y:number
  grid:Grid
}

class Cell {
  warriors:Warrior[] = []
  wootgump:number = 0
  grid:Grid
  x:number
  y:number

  constructor(opts:CellInitializeOptions) {
    this.grid = opts.grid
    this.x = opts.x
    this.y = opts.y
  }

  addWarrior(warrior:Warrior) {
    this.warriors.push(warrior)
  }

}

export default Cell
