interface WarriorStats {
  id: string
  name:string
  attack: number
  defense: number
  initialHealth: number
}

class Warrior implements WarriorStats {
  id: string
  name:string = "DefaultName"
  attack: number = 200
  defense: number = 100
  initialHealth: number = 500
  currentHealth: number = 500

  destination?:[number,number]

  wootgumpBalance = 0

  constructor(opts:WarriorStats) {
    this.id = opts.id
    this.name = opts.name
    this.attack = opts.attack
    this.defense = opts.defense
    this.initialHealth = opts.initialHealth
    this.currentHealth = this.initialHealth
  }

  isAlive() {
    return this.currentHealth > 0
  }

  // amount to add to halth as a decimal percentage (ie 0.10 is 10%) of initialHealth
  recover(percentage:number) {
    this.currentHealth = Math.min(this.initialHealth, this.initialHealth * percentage)
  }

}

export default Warrior
