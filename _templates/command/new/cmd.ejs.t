---
to: commands/<%= name %>.ts
---
import { program } from 'commander'

program.command('<%= name %>')
  .action(() => {
    console.log('run <%= name %> command!')
  })