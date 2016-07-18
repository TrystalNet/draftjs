declare module "@trystal/trist-text" {
  import {IMM} from '@trystal/interfaces'
  export function textToChain(text: string, fnNextId: (index: number) => string): IMM.Chain;
}
