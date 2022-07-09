import { program } from 'commander'

const bar = program.command('bar')
  .action(() => {
    console.log('bar command!')
  })

bar.command('yy')
  .action(() => {
    console.log('yy on the bar command')
  })

bar.command('xx')
  .action(() => {
    console.log('xx on the bar command')
  })

  
const bb = program.command('blah')
  .command('aa')
  .command('bb')
const cc = bb.command('cc')
cc.command('dd')
cc.command('ee')