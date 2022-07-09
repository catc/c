import { program } from 'commander'
import { generateCommandTree } from '../commands'


describe('generateCommandTree', () => {
  program.command('foo')
    .command('zz')

  const bar = program.command('bar')
  bar.command('yy')
  bar.command('xx')

  program.command('jam')

  const bb = program.command('blah')
    .command('aa')
    .command('bb')
  const cc = bb.command('cc')
  cc.command('dd')
  cc.command('ee')

  it('generates a valid tree for omelette', () => {
    const tree = generateCommandTree(program)


    expect(tree).toEqual({
      foo: { zz: [] },
      bar: {
        yy: [],
        xx: []
      },
      jam: [],
      blah: {
        aa: {
          bb: {
            cc: {
              dd: [],
              ee: []
            }
          }
        }
      }
    })
  })
})