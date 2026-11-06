import test from 'node:test'
import assert from 'node:assert/strict'
import { completeAnswers, stopRejection } from './stopPolicy.js'

const valid={isMember:true,instantStopEnabled:true,status:'answering',deadlineMs:2000,nowMs:1000}
test('authorized member can stop an enabled live round',()=>assert.equal(stopRejection(valid),null))
test('non-member is rejected',()=>assert.equal(stopRejection({...valid,isMember:false}),'not-member'))
test('disabled instant stop is rejected',()=>assert.equal(stopRejection({...valid,instantStopEnabled:false}),'disabled'))
test('stop at or after deadline is rejected',()=>assert.equal(stopRejection({...valid,nowMs:2000}),'deadline-passed'))
test('duplicate and concurrent loser see already-stopped',()=>assert.equal(stopRejection({...valid,status:'reviewing'}),'already-stopped'))
test('complete answers are trimmed and require the exact category set',()=>{assert.deepEqual(completeAnswers(['ولد','بلاد'],{ولد:' محمود ',بلاد:'مصر'}),{ولد:'محمود',بلاد:'مصر'});assert.equal(completeAnswers(['ولد'],{ولد:'محمود',بلاد:'مصر'}),null);assert.equal(completeAnswers(['ولد','بلاد'],{ولد:'محمود'}),null)})
test('empty, whitespace, non-string, and oversized answers are rejected',()=>{assert.equal(completeAnswers(['ولد'],{ولد:''}),null);assert.equal(completeAnswers(['ولد'],{ولد:'   '}),null);assert.equal(completeAnswers(['ولد'],{ولد:42}),null);assert.equal(completeAnswers(['ولد'],{ولد:'م'.repeat(81)}),null)})
