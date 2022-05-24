import Warrior from '../src/Warrior'
import Grid from '../src/Grid'
import { deterministicRandom } from '../src/random';

describe('Grid', () => {
  function generateFakeWarriors(count:number, seed:string) {
    let warriors = []
    for (let i = 0; i < count; i++) {
      warriors[i] = new Warrior({
        id: `warrior-${i}-${seed}`,
        name: `Warius ${i}`,
        attack: deterministicRandom(1000, `generateFakeWarriors-${i}-attack`, seed),
        defense: deterministicRandom(800, `generateFakeWarriors-${i}-defense`, seed),
        initialHealth:deterministicRandom(2000, `generateFakeWarriors-${i}-health`, seed),
      })
    }
    return warriors
  }
  
  it('sets up correctly', () => {
    const seed = 'setsUpCorrectly'
    const warriors = generateFakeWarriors(10, seed)
    const grid = new Grid({ warriors, seed })
    expect(grid).toBeDefined()
  })

  it.only('ticks', () => {
    const seed = 'ticks-2'
    const warriors = generateFakeWarriors(10, seed)
    const grid = new Grid({ warriors, seed })
    expect(grid.doTick()).toBeTruthy()
    expect(grid.doTick()).toBeTruthy()
  })

});
