import {IMM}  from '@trystal/interfaces'
import {chainOps} from '@trystal/trist'
import {textToChain} from '../src/trist-text'

import Chain = IMM.Chain

const factory = (levels:string) => {
  const words = "zero one two three four five six seven eight nine ten".split(' ') 
  return levels.split('')
  .map(strLevel => parseInt(strLevel))
  .map(level => _.repeat(' ',level) + words[level])
  .join('\n')
}

const dump = (chain:Chain) => {
  const numberOrDash = (n:number) => _.isNumber(n) ? n.toString() : '-'
  const stringOrDash = (s:string) => _.isString(s) ? s : '-'
  const cops = chainOps(chain)
  const head = cops.head() 
  return {
    rlevels : cops.rlevels(head).map(rlevel => numberOrDash(rlevel)).join(''),
    PVs     : cops.pvids(head).map(pvid => stringOrDash(pvid)).join(''),
    NVs     : cops.nvids(head).map(nvid => stringOrDash(nvid)).join(''),
  }
}

describe('Converts some text lines into a Chain', function() {
  it('tests the main test case for collapseEmAll', () => {
    const text = factory('1133221100')
    const chain = textToChain(text, index => index.toString())
    const result = dump(chain) 
    expect(result.rlevels).toEqual('1020-1000-10')
    expect(result.PVs).toEqual('-0-2341678')
  })
})
