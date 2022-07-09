import { program } from 'commander'

program.command('zap')
  .action(() => {
    console.log('zap command!')
  })
  