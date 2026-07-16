const canvas=document.getElementById('ludoCanvas');
const ctx=canvas.getContext('2d');
const S=canvas.width,C=S/15;
const COLORS={red:'#FF4757',blue:'#2196F3'};
let state={cp:0,dice:0,rolled:false,gameOver:false,
  pieces:{red:[-1,-1,-1,-1],blue:[-1,-1,-1,-1]},
  score:{red:0,blue:0}};
const mode=new URLSearchParams(location.search).get('mode')||'ai';

function draw(){
  ctx.clearRect(0,0,S,S);
  ctx.fillStyle='#1a2236';ctx.fillRect(0,0,S,S);
  // Home zones
  [{c:'#FF475733',x:0,y:0},{c:'#2196F333',x:9*C,y:0},
   {c:'#00E67633',x:9*C,y:9*C},{c:'#FFD70033',x:0,y:9*C}]
  .forEach(z=>{ctx.fillStyle=z.c;ctx.fillRect(z.x,z.y,6*C,6*C);});
  // Center
  ctx.fillStyle='#7C3AED';
  ctx.beginPath();ctx.moveTo(6*C,6*C);ctx.lineTo(9*C,7.5*C);ctx.lineTo(6*C,9*C);ctx.closePath();ctx.fill();
  ctx.fillStyle='#2196F3';
  ctx.beginPath();ctx.moveTo(9*C,6*C);ctx.lineTo(7.5*C,7.5*C);ctx.lineTo(9*C,9*C);ctx.closePath();ctx.fill();
  // Grid
  ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=0.5;
  for(let i=0;i<=15;i++){
    ctx.beginPath();ctx.moveTo(i*C,0);ctx.lineTo(i*C,S);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,i*C);ctx.lineTo(S,i*C);ctx.stroke();
  }
  drawPieces();
}

const HOME={
  red:[[1,1],[4,1],[1,4],[4,4]],
  blue:[[10,1],[13,1],[10,4],[13,4]]
};

function getPiecePos(color,i){
  const p=state.pieces[color][i];
  if(p===-1){const h=HOME[color][i];return{x:(h[0]+.5)*C,y:(h[1]+.5)*C};}
  if(p>=52)return{x:7.5*C,y:7.5*C};
  const path=getPath(color);
  return path[p%path.length]||{x:7.5*C,y:7.5*C};
}

function getPath(color){
  const path=[];
  if(color==='red'){
    for(let c=6;c<=14;c++)path.push({x:(c+.5)*C,y:13.5*C});
    for(let r=14;r>=9;r--)path.push({x:.5*C,y:(r+.5)*C});
    for(let r=13;r>=9;r--)path.push({x:.5*C,y:(r+.5)*C});
    for(let c=1;c<=5;c++)path.push({x:(c+.5)*C,y:9.5*C});
    for(let r=8;r>=0;r--)path.push({x:5.5*C,y:(r+.5)*C});
    for(let c=6;c<=14;c++)path.push({x:(c+.5)*C,y:.5*C});
    for(let r=1;r<=5;r++)path.push({x:14.5*C,y:(r+.5)*C});
    for(let c=13;c>=9;c--)path.push({x:(c+.5)*C,y:5.5*C});
    for(let r=6;r<=13;r++)path.push({x:9.5*C,y:(r+.5)*C});
  }else{
    for(let r=6;r<=14;r++)path.push({x:1.5*C,y:(r+.5)*C});
    for(let c=1;c<=5;c++)path.push({x:(c+.5)*C,y:14.5*C});
    for(let c=6;c<=14;c++)path.push({x:(c+.5)*C,y:14.5*C});
    for(let r=13;r>=9;r--)path.push({x:14.5*C,y:(r+.5)*C});
    for(let c=13;c>=9;c--)path.push({x:(c+.5)*C,y:9.5*C});
    for(let r=8;r>=0;r--)path.push({x:9.5*C,y:(r+.5)*C});
    for(let c=8;c>=0;c--)path.push({x:(c+.5)*C,y:.5*C});
    for(let r=1;r<=5;r++)path.push({x:.5*C,y:(r+.5)*C});
    for(let c=1;c<=5;c++)path.push({x:(c+.5)*C,y:5.5*C});
  }
  while(path.length<52)path.push({x:7.5*C,y:7.5*C});
  return path;
}

function drawPieces(){
  ['red','blue'].forEach(color=>{
    state.pieces[color].forEach((p,i)=>{
      const pos=getPiecePos(color,i);
      ctx.beginPath();ctx.arc(pos.x,pos.y,C*.38,0,Math.PI*2);
      ctx.fillStyle=COLORS[color];ctx.fill();
      ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='#fff';ctx.font=`bold ${C*.3}px Inter`;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(i+1,pos.x,pos.y);
    });
  });
}

function rollDice(){
  if(state.rolled||state.gameOver)return;
  const d=document.getElementById('dice');
  d.style.animation='none';
  setTimeout(()=>{
    state.dice=Math.floor(Math.random()*6)+1;
    const f=['⚀','⚁','⚂','⚃','⚄','⚅'];
    d.textContent=f[state.dice-1];
    document.getElementById('diceResult').textContent='Rolled: '+state.dice;
    state.rolled=true;
    handleTurn();
  },200);
}

function handleTurn(){
  const pl=['red','blue'][state.cp];
  const movable=state.pieces[pl].map((p,i)=>({i,p})).filter(({p})=>{
    if(p===-1)return state.dice===6;
    if(p>=52)return false;
    return p+state.dice<=52;
  });
  if(!movable.length){setStatus('No moves! Skipping...');setTimeout(nextTurn,1000);return;}
  if(mode==='ai'&&state.cp===1){
    setTimeout(()=>movePiece(pl,movable[movable.length-1].i),700);
  }else{
    setStatus(pl.toUpperCase()+': Tap a piece');
    canvas.onclick=e=>{
      const r=canvas.getBoundingClientRect();
      const mx=(e.clientX-r.left)*(S/r.width);
      const my=(e.clientY-r.top)*(S/r.height);
      movable.forEach(({i})=>{
        const pos=getPiecePos(pl,i);
        const dx=pos.x-mx,dy=pos.y-my;
        if(Math.sqrt(dx*dx+dy*dy)<C*.45){canvas.onclick=null;movePiece(pl,i);}
      });
    };
  }
}

function movePiece(pl,i){
  if(state.pieces[pl][i]===-1)state.pieces[pl][i]=0;
  else state.pieces[pl][i]+=state.dice;
  state.score[pl]+=state.dice*10;
  document.getElementById('score').textContent=state.score[['red','blue'][0]];
  if(state.pieces[pl].filter(p=>p>=52).length===4){endGame(pl);return;}
  draw();
  state.rolled=false;
  if(state.dice!==6)nextTurn();
  else setStatus('🎉 Roll again!');
}

function nextTurn(){
  state.cp=1-state.cp;
  const pl=['red','blue'][state.cp];
  document.getElementById('turnDisplay').textContent=pl.charAt(0).toUpperCase()+pl.slice(1);
  document.getElementById('turnIndicator').textContent=pl==='red'?'🔴 Red\'s Turn':'🔵 Blue\'s Turn';
  document.getElementById('dice').textContent='🎲';
  document.getElementById('diceResult').textContent='Click to roll';
  state.rolled=false;setStatus('');draw();
  if(mode==='ai'&&state.cp===1)setTimeout(rollDice,600);
}

function endGame(winner){
  state.gameOver=true;
  setStatus('🏆 '+winner.toUpperCase()+' WINS!');draw();
  window.parent?.postMessage({type:'GAME_OVER',score:state.score[winner],result:winner==='red'?'win':'loss'},'*');
}

function restartGame(){
  state={cp:0,dice:0,rolled:false,gameOver:false,
    pieces:{red:[-1,-1,-1,-1],blue:[-1,-1,-1,-1]},score:{red:0,blue:0}};
  document.getElementById('dice').textContent='🎲';
  document.getElementById('diceResult').textContent='Click to roll';
  document.getElementById('score').textContent='0';
  document.getElementById('turnDisplay').textContent='Red';
  document.getElementById('turnIndicator').textContent='🔴 Red\'s Turn';
  setStatus('');draw();
}

function setStatus(m){document.getElementById('statusMsg').textContent=m;}
draw();
