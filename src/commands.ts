import { readdirSync } from 'fs'
import path from 'path'
import { Command } from 'commander'
import { TreeValue } from 'omelette'

const RESERVED_COMMANDS = new Set([
  'new',
  'link',
  'implode'
])


const COMMANDS_DIR = '../commands'
const DIR = path.resolve(__dirname, COMMANDS_DIR)

export function loadCommands(program: Command){
  const cmds = readdirSync(DIR).filter(f => f.match(/\.(t|j)s$/))
  
  cmds.forEach(file => {
    // TODO - add check that filename doenst match reserved commands... if it does show error that it wasnt loaded
    require(`./${COMMANDS_DIR}/${file}`)
  })
}


type Branch = Record<string, {}> | []

export function generateCommandTree(program: Command){
  const tree: TreeValue = {}
  
  program.commands.forEach(c => walk(c, tree))
  function walk(cmd: Command, tree: any) {
    const name = cmd.name()
    
    let branch: Branch = []
    if (cmd.commands.length){
      branch = {}
      cmd.commands.forEach(c => walk(c, branch))
    } 
    tree[name] = branch
  }

  return tree
}

