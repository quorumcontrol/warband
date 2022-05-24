import Warrior from '../src/Warrior'
import Grid from '../src/Grid'
import { getRandomInteger } from '../src/random';

describe('Grid', () => {
  function generateFakeWarriors(count:number) {
    let warriors = []
    for (let i = 0; i < count; i++) {
      warriors[i] = new Warrior({
        name: `Warrior: ${i}`,
        attack: getRandomInteger(1000),
        defense: getRandomInteger(800),
        initialHealth: getRandomInteger(2000),
      })
    }
  }
  
  it('sets up correct', () => {

  })
});
