const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let info = [];
let blocked = [];
let maxNum = Number(process.argv.slice(3)[0]) || 4000000;

eachLine(filename, function(line) {
  let parts = line.split(":").map(a=>a.split(",")).map(a=>a.map(b=>b.split("=").map(c=>Number(c))));
  let senX = parts[0][0][1];
  let senY = parts[0][1][1];
  let beaX = parts[1][0][1];
  let beaY = parts[1][1][1];
  let manDistance = Math.abs(senX-beaX)+Math.abs(senY-beaY);
  info.push([[senX,senY],[beaX,beaY],manDistance]);
}).then(function(err) {
  console.log(info);
  for(let cy=0;cy<=maxNum&&answer===0;cy++) {
    blocked = [];
    for(let i=0;i<info.length;i++) {
      let tarDistance = Math.abs(info[i][0][1]-cy);
      let bloDistance = info[i][2] - tarDistance;
      if(bloDistance >= 0) {
        let bmin = info[i][0][0]-bloDistance;
        let bmax = info[i][0][0]+bloDistance;
        if(bmin < 0) {
          bmin = 0;
        }
        if(bmax < 0) {
          bmax = 0;
        }
        if(bmin > maxNum) {
          bmin = maxNum;
        }
        if(bmax > maxNum) {
          bmax = maxNum;
        }
        blocked.push([bmin,bmax]);
      }
    }
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
    let block = dBlock.map(a=>a[1]-a[0]+1).reduce((a,b)=>a+b);
    if(block!==(maxNum+1)) {
      console.log(`cy is ${cy}`);
      for(let cx=0;cx<=maxNum&&answer===0;cx++) {
        let filt = dBlock.filter(tmp=>!(tmp[1]<cx||tmp[0]>cx));
        if(filt.length===0) {
          console.log(`cx is ${cx}`);
          answer = 4000000 * cx + cy;
        }
      }
    }
  }
  console.log(answer);
});
