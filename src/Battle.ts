import { deterministicRandom } from "./random"
import Warrior from "./Warrior"
import debug from 'debug'

const log = debug('Battle')

interface BattleOptions {
  warriors: Warrior[]
  startingTick: number
  seed: string
}

const WOOTGUMP_TAKE_PERCENTAGE = 0.5

class Battle {
  warriors: Warrior[]
  tick: number
  seed: string
  previousWinner?:Warrior

  constructor(opts: BattleOptions) {
    this.warriors = opts.warriors
    this.seed = opts.seed
    this.tick = opts.startingTick
  }

  doBattleTick(tick: number, seed: string) {
    this.tick = tick
    this.seed = seed
    const { attacker, defender } = this.getPositions()
    const attackRoll = this.rand(attacker.attack)
    const defenseRoll = this.rand(defender.defense)
    if (attackRoll > defenseRoll) {
      defender.currentHealth -= (attackRoll - defenseRoll)
      this.log(`${attacker.name} hits ${defender.name} for ${attackRoll - defenseRoll} ${defender.currentHealth} left`)
    } else {
      this.log(`${defender.name} blocks ${attacker.name}`)
    }
    this.previousWinner = (attackRoll > defenseRoll) ? attacker : defender
    if (this.isOver()) {
      const wootGumpToTake = Math.floor(this.winner()!.wootgumpBalance * WOOTGUMP_TAKE_PERCENTAGE)
      this.loser()!.wootgumpBalance -= wootGumpToTake
      this.winner()!.wootgumpBalance += wootGumpToTake
    }
  }

  winner() {
    if (!this.isOver()) {
      throw new Error('not over yet')
    }
    return this.warriors.find((w) => w.isAlive())
  }

  loser() {
    if (!this.isOver()) {
      throw new Error('not over yet')
    }
    return this.warriors.find((w) => w.isAlive())
  }

  isOver() {
    // if one warrior is dead then it's over.
    return this.warriors.some((w) => {
      return !w.isAlive()
    })
  }

  private getPositions() {
    if (this.previousWinner) {
      const attackerIndex = this.rand(3)
      let attacker:Warrior
      if (attackerIndex === 2) {
        attacker = this.previousWinner
      } else {
        attacker = this.warriors[attackerIndex]
      }
      const defender = this.warriors.find((w) => w !== attacker)!
      return { attacker, defender }
    }

    const attacker = this.warriors[this.rand(2)]
    const defender = this.warriors.find((w) => w !== attacker)!
    return { attacker, defender }
  }

  private rand(max:number) {
    return deterministicRandom(max, `${this.battleId()}-${this.tick}`, this.seed)
  }

  private battleId() {
    return `battle-${this.warriors[0].id}-${this.warriors[1].id}-${this.tick}`
  }

  private log(...args:any[]) {
    log(args)
  }
}

export default Battle
