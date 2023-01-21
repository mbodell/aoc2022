const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let target = Number(process.argv.slice(3)[0]) || 2000000;
let info = [];
let blocked = [];
let tBea = new Set();

eachLine(filename, function(line) {
  let parts = line.split(":").map(a=>a.split(",")).map(a=>a.map(b=>b.split("=").map(c=>Number(c))));
  let senX = parts[0][0][1];
  let senY = parts[0][1][1];
  let beaX = parts[1][0][1];
  let beaY = parts[1][1][1];
  let manDistance = Math.abs(senX-beaX)+Math.abs(senY-beaY);
  let tarDistance = Math.abs(senY-target);
  let bloDistance = manDistance - tarDistance;
  if(bloDistance >= 0) {
    blocked.push([senX-bloDistance,senX+bloDistance]);
  }
  info.push([[senX,senY],[beaX,beaY],manDistance,bloDistance]);
  if(beaY === target) {
    tBea.add(beaX);
  }
}).then(function(err) {
  console.log(info);
  console.log(blocked);
  let dBlock = [];
  while(blocked.length) {
    let can = blocked.pop();
    let filt = dBlock.filter(tmp=>!(tmp[1]<can[0]||tmp[0]>can[1]));
    if(filt.length===0) {
      dBlock.push(can);
    } else {
      let good = filt.pop();
      if(can[0]<good[0]) {
        blocked.push([can[0],good[0]-1]);
      }
      if(good[1]<can[1]) {
        blocked.push([good[1]+1,can[1]]);
      }
    }
  }
  console.log(dBlock);
  answer = dBlock.map(a=>a[1]-a[0]+1).reduce((a,b)=>a+b);
  console.log(answer);
  let bea = [...tBea];
  while(bea.length) {
    let can = bea.pop();
    let filt = dBlock.filter(tmp=>!(tmp[1]<can||tmp[0]>can));
    if(filt.length!==0) {
      answer--;
    }
  }
  console.log(answer);
});
