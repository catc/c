import { program } from 'commander'

program.command('foo')
  .action(() => {
    console.log('foo command!')
  })
  .command('zz')
  .action(() => {
    console.log('zz on the foo command')
  })

