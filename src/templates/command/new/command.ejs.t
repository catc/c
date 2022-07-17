---
to: <%= path %>
---
import { program } from 'commander'

program
	.command('<%= name %>')
	.description('command description')
	.action(() => {
		console.log('run <%= name %> command!')
	})
