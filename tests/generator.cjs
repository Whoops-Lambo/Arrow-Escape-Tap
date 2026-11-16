// No dependencies: test the actual single-file game's generator in Node.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const source=html.slice(html.indexOf('function rng('),html.indexOf('function dailyDate('));
const context=vm.createContext({});
vm.runInContext(`const TOTAL=150,COLORS=['mint'],dirs=[[0,-1],[1,0],[0,1],[-1,0]],key=(x,y)=>x+','+y;${source};globalThis.api={generate,solve,levelSpec,TIERS};`,context);
const {generate,solve,levelSpec,TIERS}=context.api;
const tiers=new Set(),sizes=new Set();let tested=0,maxMs=0;
for(let level=1;level<=150;level++)for(let seed=0;seed<3;seed++){
 const start=performance.now(),g=generate(level,level*777+seed);maxMs=Math.max(maxMs,performance.now()-start);
 assert.equal(g.pieces.length,g.count);assert.ok(g.count>=g.tier.min&&g.count<=g.tier.max);
 assert.equal(solve(g.pieces,g.n).length,g.count);const occupied=new Set();
 for(const p of g.pieces){assert.ok(p.cells.length>=2);for(let i=0;i<p.cells.length;i++){
  const [x,y]=p.cells[i];assert.ok(x>=0&&y>=0&&x<g.n&&y<g.n);assert.ok(!occupied.has(`${x},${y}`));occupied.add(`${x},${y}`);
  if(i)assert.equal(Math.abs(x-p.cells[i-1][0])+Math.abs(y-p.cells[i-1][1]),1);
 }}
 tiers.add(g.tier.name);sizes.add(g.n);tested++;
}
assert.equal(tiers.size,6);assert.ok(sizes.size>10);
assert.equal(JSON.stringify(generate(42,99)),JSON.stringify(generate(42,99)));
// Independent cyclic fixture: solver must reject mutually blocking rays.
assert.equal(solve([{id:0,cells:[[0,0],[1,0]],dir:1},{id:1,cells:[[3,0],[2,0]],dir:3}],4),null);
// Ensure Extreme Nightmare can actually reach the requested upper count.
const level=Array.from({length:150},(_,i)=>150-i).find(l=>levelSpec(l,0).tierIndex===5);
let found=false;for(let seed=0;seed<1000;seed++)if(levelSpec(level,seed).count===400){assert.equal(generate(level,seed).pieces.length,400);found=true;break}
assert.ok(found,'400-arrow board is reachable');
console.log(`${tested} boards passed: exact counts, six tiers, ${sizes.size} grid sizes, solvability, adjacency, bounds, non-overlap, deterministic seeds, cycle rejection, 400-arrow board. Slowest generation: ${Math.round(maxMs)} ms.`);
