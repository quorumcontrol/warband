import { table as dashboardTable, grid as DashboardGrid } from 'blessed-contrib'
import { screen as makeScreen } from 'blessed'
import { deterministicRandom } from '../random'
import Warrior from '../Warrior'
import Grid from '../Grid'

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

async function main() {
  const seed = 'ticks-2'
  const warriors = generateFakeWarriors(20, seed)
  const grid = new Grid({ warriors, seed })


  const screen = makeScreen()

  const dashboardGrid = new DashboardGrid({ rows: 2, cols: 2, screen })

  var gridTable = dashboardGrid.set(0,0,1,2, dashboardTable,
     { keys: true
     , vi: true
     , fg: 'white'
     , selectedFg: 'white'
     , selectedBg: 'blue'
     , interactive: 'false'
     , label: 'Arctic Jungle'
    //  , width: '100%'
    //  , height: '50%'
     , border: {type: "line", fg: "cyan"}
     , columnSpacing: 2
     , columnWidth: Array(grid.grid[0].length).fill(7)})
  
  var warriorStatsTable = dashboardGrid.set(1,0,1,1, dashboardTable,
      { keys: true
      , vi: true
      , fg: 'white'
      , selectedFg: 'white'
      , selectedBg: 'blue'
      , interactive: 'false'
      , label: 'Scoreboard'
      // , width: '50%'
      // , height: '40%'
      , border: {type: "line", fg: "cyan"}
      , columnSpacing: 2
      , columnWidth: [15, 6, 6]})

  // gridTable.focus()
  // screen.append(gridTable)
  // screen.append(warriorStatsTable)
  const update = () => {
    warriorStatsTable.setData({
      headers: ["Name", "Wootgump", "Health"],
      data: grid.warriors!.map((w) => {
        return [w.name, w.wootgumpBalance.toString(), w.currentHealth.toString()]
      })
    })
    gridTable.setData(
      { headers: Array(grid.grid[0].length).fill('')
      , data: grid.grid.map((cells) => {
        return cells.map((cell) => {
          if (cell.wootgump === 0 && cell.warriors.length === 0) {
            return ''
          }
          let txt = ''
          if (cell.wootgump > 0) {
            txt = `${txt} wg:${cell.wootgump} `
          }
   
          cell.warriors.forEach(() => {
            txt += 'W'
          })
          cell.battles.forEach(() => {
            txt += 'B'
          })
          return txt
        })
      })})
  }
  
  update()

  setInterval(() => {
    grid.doTick()
    update()
    screen.render()
  }, 4000)
  
  screen.key(['escape', 'q', 'C-c'], function() {
    return process.exit(0);
  });
  
  screen.render()
}

main().then(() => {
  console.log('done')
}).catch((err) => {
  console.error('err: ', err)
})

