import { describe,expect,it } from 'vitest'
import { countdownCue,transitionSound } from './countdown.js'
describe('countdownCue',()=>{
  it('emits exact boundaries once and nothing outside answering',()=>{expect(countdownCue({previous:31,current:30})).toBe('tick');expect(countdownCue({previous:30,current:30})).toBeNull();expect(countdownCue({previous:6,current:5})).toBe('tickStrong');expect(countdownCue({previous:2,current:1})).toBe('tickFinal');expect(countdownCue({previous:1,current:0})).toBe('roundEnd');expect(countdownCue({previous:10,current:9,status:'reviewing'})).toBeNull()})
  it('skips missed background/reconnect ticks',()=>{expect(countdownCue({previous:35,current:30})).toBeNull();expect(countdownCue({previous:11,current:8})).toBeNull();expect(countdownCue({previous:10,current:9,visible:false})).toBeNull();expect(countdownCue({previous:null,current:10})).toBeNull()})
  it('prioritizes instant stop over timer sounds',()=>expect(countdownCue({previous:4,current:4,status:'reviewing',stopReason:'harfana'})).toBe('harfana'))
})
describe('transitionSound',()=>it('selects results and final winner sounds',()=>{expect(transitionSound({from:'reviewing',to:'finalized'})).toBe('results');expect(transitionSound({from:'reviewing',to:'finalized',isFinalRound:true})).toBe('winner')}))
