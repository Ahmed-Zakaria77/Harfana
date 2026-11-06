const TIMER_SOUNDS=new Set(['tick','tickStrong','tickFinal','roundEnd'])
const SESSION_KEY='harfana:audio-events'

export class AudioManager {
  constructor({ contextFactory, storage }={}) {
    this.contextFactory=contextFactory||(()=>{const Context=globalThis.AudioContext||globalThis.webkitAudioContext;return Context?new Context():null})
    this.storage=storage||globalThis.sessionStorage
    this.context=null;this.settings=()=>({muted:false,effectsEnabled:true,timerEnabled:true,volume:.6});this.timerNodes=new Set();this.lastPlayed=new Map()
    try{this.events=new Set(JSON.parse(this.storage?.getItem(SESSION_KEY)||'[]'))}catch{this.events=new Set()}
  }
  configure(getSettings){this.settings=getSettings}
  async unlock(){try{this.context ||= this.contextFactory();if(!this.context)return false;if(this.context.state==='suspended')await this.context.resume();return this.context.state==='running'}catch{return false}}
  seen(eventId){return Boolean(eventId&&this.events.has(eventId))}
  mark(eventId){if(!eventId)return;this.events.add(eventId);if(this.events.size>160)this.events.delete(this.events.values().next().value);try{this.storage?.setItem(SESSION_KEY,JSON.stringify([...this.events]))}catch{}}
  async play(name,{eventId,force=false}={}){const settings=this.settings();if(settings.muted||(!settings.effectsEnabled&&!TIMER_SOUNDS.has(name))||(!settings.timerEnabled&&TIMER_SOUNDS.has(name))||this.seen(eventId))return false;const now=globalThis.performance?.now?.()||Date.now();if(!force&&now-(this.lastPlayed.get(name)||0)<80)return false;if(!await this.unlock())return false;this.lastPlayed.set(name,now);this.mark(eventId);if(name==='harfana')this.stopTimer();this.synthesize(name,settings.volume);return true}
  playOnce(name,eventId){return this.play(name,{eventId})}
  stopTimer(){for(const node of this.timerNodes){try{node.stop()}catch{}}this.timerNodes.clear()}
  tone(freq,start,duration,{type='sine',gain=.12,timer=false}={}){const ctx=this.context,osc=ctx.createOscillator(),amp=ctx.createGain(),at=ctx.currentTime+start;osc.type=type;osc.frequency.setValueAtTime(freq,at);amp.gain.setValueAtTime(.0001,at);amp.gain.exponentialRampToValueAtTime(Math.max(.0001,gain),at+.015);amp.gain.exponentialRampToValueAtTime(.0001,at+duration);osc.connect(amp).connect(ctx.destination);osc.start(at);osc.stop(at+duration+.02);if(timer){this.timerNodes.add(osc);osc.onended=()=>this.timerNodes.delete(osc)}}
  synthesize(name,volume){const g=Math.max(.01,Math.min(.22,volume*.2));switch(name){case'click':this.tone(520,0,.055,{type:'triangle',gain:g*.35});break;case'select':this.tone(680,0,.09,{type:'sine',gain:g*.55});this.tone(880,.045,.1,{gain:g*.45});break;case'join':this.tone(440,0,.11,{type:'triangle',gain:g*.45});this.tone(660,.1,.16,{type:'triangle',gain:g*.55});break;case'roundStart':[523,659,784,1047].forEach((f,i)=>this.tone(f,i*.12,.2,{type:'triangle',gain:g*(.55+i*.08)}));break;case'complete':this.tone(659,0,.15,{gain:g*.5});this.tone(988,.1,.22,{gain:g*.65});break;case'tick':this.tone(720,0,.06,{type:'square',gain:g*.22,timer:true});break;case'tickStrong':this.tone(620,0,.085,{type:'square',gain:g*.4,timer:true});break;case'tickFinal':this.tone(520,0,.11,{type:'square',gain:g*.55,timer:true});this.tone(780,.04,.08,{gain:g*.25,timer:true});break;case'roundEnd':this.tone(392,0,.18,{type:'sawtooth',gain:g*.45,timer:true});this.tone(262,.16,.35,{type:'triangle',gain:g*.55,timer:true});break;case'harfana':[784,1047,1319].forEach((f,i)=>this.tone(f,i*.08,.24,{type:'triangle',gain:g*(.6+i*.1)}));this.tone(1568,.27,.42,{gain:g*.75});break;case'results':[523,659,784].forEach((f,i)=>this.tone(f,i*.1,.28,{gain:g*.55}));break;case'winner':[523,659,784,1047,1319].forEach((f,i)=>this.tone(f,i*.1,.32,{type:'triangle',gain:g*.62}));break}}
  dispose(){this.stopTimer();try{this.context?.close()}catch{}this.context=null}
}

export const audioManager=new AudioManager()
