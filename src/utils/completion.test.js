import { describe, expect, it } from 'vitest'
import { answerCompletion } from './completion.js'
describe('answerCompletion',()=>{
  it('blocks empty and whitespace-only answers',()=>{expect(answerCompletion(['ولد','بلاد'],{ولد:'محمود',بلاد:'   '})).toMatchObject({completed:1,isComplete:false,missing:['بلاد']})})
  it('accepts all selected categories when filled',()=>{expect(answerCompletion(['ولد','بلاد'],{ولد:' محمود ',بلاد:'مصر'})).toMatchObject({completed:2,total:2,isComplete:true})})
  it('responds to dynamic category changes',()=>{const answers={ولد:'محمود'};expect(answerCompletion(['ولد'],answers).isComplete).toBe(true);expect(answerCompletion(['ولد','حيوان'],answers)).toMatchObject({completed:1,total:2,isComplete:false})})
  it('ignores extra keys when calculating UI progress',()=>{expect(answerCompletion(['ولد'],{ولد:'محمود',غيرمسموح:'x'})).toMatchObject({completed:1,total:1,isComplete:true})})
})
