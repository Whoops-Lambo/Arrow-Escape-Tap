// No dependencies: test the actual single-file game's generator in Node.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const source=html.slice(html.indexOf('function rng('),html.indexOf('function dailyDate('));
const TOTAL=Number(html.match(/TOTAL=(\d+)/)[1]);
assert.equal(TOTAL,1000);
const {generate,solve,levelSpec,TIERS}=new Function(`const TOTAL=${TOTAL},COLORS=['mint'],dirs=[[0,-1],[1,0],[0,1],[-1,0]],key=(x,y)=>x+','+y;${source};return {generate,solve,levelSpec,TIERS};`)();
const tiers=new Set(),sizes=new Set();let straightTotal=0,bentTotal=0;let tested=0,maxMs=0;
for(let level=1;level<=TOTAL;level++)for(let seed=0;seed<1;seed++){
 const start=performance.now(),g=generate(level,level*777+seed);maxMs=Math.max(maxMs,performance.now()-start);
 assert.equal(g.pieces.length,g.count);assert.ok(g.count>=g.tier.min&&g.count<=g.tier.max);
 assert.equal(solve(g.pieces,g.n).length,g.count);const occupied=new Set();
 let straight=0,bent=0;for(const p of g.pieces){const steps=p.cells.slice(1).map((c,i)=>[c[0]-p.cells[i][0],c[1]-p.cells[i][1]].join(','));const turns=steps.slice(1).filter((d,i)=>d!==steps[i]).length;if(turns===0)straight++;else bent++;assert.ok(p.cells.length>=2);const head=p.cells.at(-1),neck=p.cells.at(-2),direction=[[0,-1],[1,0],[0,1],[-1,0]][p.dir];assert.equal(head[0]-neck[0],direction[0]);assert.equal(head[1]-neck[1],direction[1]);for(let i=0;i<p.cells.length;i++){
  const [x,y]=p.cells[i];assert.ok(x>=0&&y>=0&&x<g.n&&y<g.n);assert.ok(!occupied.has(`${x},${y}`));occupied.add(`${x},${y}`);
  if(i)assert.equal(Math.abs(x-p.cells[i-1][0])+Math.abs(y-p.cells[i-1][1]),1);
 }}
 assert.ok(straight>=Math.floor(g.count*.15),'Straight arrow variety');assert.ok(bent>0,'Bent arrow variety');straightTotal+=straight;bentTotal+=bent;
 assert.equal(occupied.size,g.width*g.height,'No empty cells in dense bounds');
 tiers.add(g.tier.name);sizes.add(g.n);tested++;
}
assert.equal(tiers.size,6);assert.ok(sizes.size>10);
assert.equal(JSON.stringify(generate(42,99)),JSON.stringify(generate(42,99)));
// Independent cyclic fixture: solver must reject mutually blocking rays.
assert.equal(solve([{id:0,cells:[[0,0],[1,0]],dir:1},{id:1,cells:[[3,0],[2,0]],dir:3}],4),null);
// Ensure Extreme Nightmare can actually reach the requested upper count.
const level=Array.from({length:TOTAL},(_,i)=>TOTAL-i).find(l=>levelSpec(l,0).tierIndex===5);
let found=false;for(let seed=0;seed<1000;seed++)if(levelSpec(level,seed).count===400){assert.equal(generate(level,seed).pieces.length,400);found=true;break}
assert.ok(found,'400-arrow board is reachable');
console.log(`${tested} boards passed: exact counts, six tiers, ${sizes.size} grid sizes, solvability, adjacency, bounds, non-overlap, full density, deterministic seeds, cycle rejection, 400-arrow board. Slowest generation: ${Math.round(maxMs)} ms.`);
