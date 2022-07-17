---
to: <%= path %>
---
import { program } from 'commander'

program.command('<%= name %>').action(() => {
	console.log('run <%= name %> command!')
})
