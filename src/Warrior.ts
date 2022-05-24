
interface WarriorStats {
  name:string
  attack: number
  defense: number
  initialHealth: number
}

class Warrior implements WarriorStats {
  name:string = "DefaultName"
  attack: number = 200
  defense: number = 100
  initialHealth: number = 500
  currentHealth: number = 500

  constructor(opts:WarriorStats) {
    this.name = opts.name
    this.attack = opts.attack
    this.defense = opts.defense
    this.initialHealth = opts.initialHealth
    this.currentHealth = this.initialHealth
  }
}

export default Warrior
