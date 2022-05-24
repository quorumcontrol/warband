import Grid from "./Grid"
import { deterministicRandom } from "./random"
import Warrior from "./Warrior"
import debug from 'debug'
import Battle from "./Battle"

const log = debug('Cell')


interface CellInitializeOptions {
  x:number
  y:number
  grid:Grid
}

class Cell {
  warriors:Warrior[] = []
  outgoing:Warrior[] = []
  incoming:Warrior[] = []

  battles:Battle[] = []
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

  handleOutcomes(tick:number, seed:string) {
    this.warriors = this.warriors.filter((w) => {
      return !this.outgoing.includes(w)
    })
    this.outgoing = []
    this.incoming.forEach((warrior) => {
      this.addWarrior(warrior)
    })
    this.incoming = []

    this.maybeSpawnWootgump(tick, seed)
    this.maybeSetupBattle(tick, seed)
    if (this.battles.length > 0) {
     this.battles.forEach((b) => {
       b.doBattleTick(tick, seed)
     })
     this.battles = this.battles.filter((b) => !b.isOver())
    } else {
      this.rejuvanize()
    }
    this.harvest()
  }

  doMovement(tick: number, seed:string) {
    const movers = this.nonBattlingWarriors()
    movers.forEach((warrior) => {
      if (warrior.destination) {
        throw new Error('destination not yet supported')
      }
      const newCell = this.grid.grid[this.x + this.randomX(warrior, tick, seed)][this.y + this.randomY(warrior, tick, seed)]
      this.outgoing.push(warrior)
      this.log(`${warrior.name} moves to ${newCell.x} ${newCell.y}`)
      newCell.incoming.push(warrior)
    })
  }

  private randomX(warrior:Warrior, tick: number, seed:string):number {
    switch(this.x) {
      case 0:
        return 1
      case (this.grid.sizeX - 1):
        return -1
      default:
        return this.rand(3, tick, seed, `${warrior.id}-x`) - 1 // this makes it -1,0,1
    }
  }

  private randomY(warrior:Warrior, tick: number, seed:string):number {
    switch(this.y) {
      case 0:
        return 1
      case (this.grid.sizeY - 1):
        return -1
      default:
        return this.rand(3, tick, seed, `${warrior.id}-y`) - 1 // this makes it -1,0,1
    }
  }

  private harvest() {
    const harvesters = this.nonBattlingWarriors()
    if (harvesters.length == 0) {
      return
    }
    let i = 0
    while (this.wootgump > 0) {
      this.wootgump -= 1
      harvesters[i % harvesters.length].wootgumpBalance += 1
      i++
    }
  }

  private maybeSetupBattle(tick: number, seed: string) {
    const nonBattling = this.nonBattlingWarriors()
    if (nonBattling.length >= 2) {
      this.battles.push(new Battle({warriors: nonBattling.slice(0,2), startingTick: tick, seed: seed}))
    }
  }

  private nonBattlingWarriors() {
    const inBattle = this.battlingWarriors()
    return this.warriors.filter((w) => {
      return !inBattle.includes(w)
    })
  }

  private battlingWarriors() {
    return this.battles.map((b) => b.warriors).flat()
  }


  private livingWarriors() {
    return this.warriors.filter((w) => w.isAlive())
  }

  private rejuvanize() {
    if (this.livingWarriors().length > 0) {
      this.log('rejuvanizing')
    }
    // if there isn't a battle going on then the wootgump can restore the health of warriors
    // TODO: we can make this way more complicated if we want with nearby wootgump, etc... for now it's 10%
    this.warriors.filter((w) => w.recover(0.10))
  }

  private maybeSpawnWootgump(tick:number, seed:string) {
    const wootGumpRoll = this.rand(1000, tick, seed)
    if (wootGumpRoll <= this.grid.chanceOfSpawningWootGumpIn1000) {
      this.log('adding wootgump')
      this.wootgump++
    }
  }

  private rand(max: number, tick:number, seed:string, extraId = '') {
    return deterministicRandom(max, `${this.grid.id}-${this.x}-${this.y}-${tick}${extraId}`, seed)
  }

  private log(...args:any[]) {
    return log(this.x, this.y, ...args)
  }

}

export default Cell
