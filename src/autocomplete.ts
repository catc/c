import { Option, Command, OptionValues } from 'commander'
import omelette from 'omelette'
import { generateCommandTree } from './commands'

const COMPLETION_KEYWORDS = new Set([
  'completion',
  'completion-fish',
  'compzsh',
  'compbash',
  'compfish',
  'compgen'
])

export function hasCompletionOption(opts: OptionValues) {
  return Object.keys(opts).find(opt => COMPLETION_KEYWORDS.has(opt))
}

// TODO - generate tree of commands and allow autocomplete - see if possible
function generateAutocomplete(program: Command) {
  // const completion = omelette(`${program.name()} <command>`)

  // TODO - support subcommands
  const commands = program.commands.map(c => c.name())

  // console.log(commands)
  // completion.on('command', ({ reply }) => { reply(commands) }) // KINDA WORKS
  omelette(program.name()).tree(generateCommandTree(program)).init();
  // omelette(program.name()).tree({
  //   foo: ['zz'],
  //   bar: ['xx', 'yy'],
  //   zap: [],
  //   aa: {
  //     bb: {
  //       cc: {
  //         dd: [
  //           'ee', 'ff'
  //         ],
  //         // gg: []
  //       }
  //     }
  //   }
  // }).init();

  // completion.on('name', ({ reply }) => { reply(['fatih', 'rotimi']) });
  // completion.on('surname', ({ reply }) => { reply(['akin', 'best']) });

  // completion.init();
}

// returns shell autocomplete text
export function handleAutocomplete(program: Command){
  const opts = program.opts()
  if (hasCompletionOption(opts)){
    generateAutocomplete(program)
  }
}

// adds options to program to support autocomplete
export function setupAutoCompleteOptions(program: Command){
  COMPLETION_KEYWORDS.forEach(opt => {
    program.addOption(new Option(`--${opt}`).hideHelp())
  })
}

// export default class AutoComplete {
//   constructor(program: Command){
//     COMPLETION_KEYWORDS.forEach(opt => {
//       program.addOption(new Option(`--${opt}`).hideHelp())
//     })
//   }
// }