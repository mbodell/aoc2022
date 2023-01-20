const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let rocks = [];

let minX = 100000;
let maxX = -10000;
let maxY = -1;

let cave = [];

eachLine(filename, function(line) {
  rocks.push(line.split(" -> ").map(a=>a.split(",").map(a=>Number(a))));
}).then(function(err) {
  minX = Math.min(...rocks.map(a=>Math.min(...a.map(a=>a[0]))))-1;
  maxX = Math.max(...rocks.map(a=>Math.max(...a.map(a=>a[0]))))+1;
  maxY = Math.max(...rocks.map(a=>Math.max(...a.map(a=>a[1]))))+1;
  let start = 500-minX;
  let width = maxX-minX+1;

  cave = Array(maxY+1).fill().map(() => Array(width).fill('.'));
  cave[0][start] = '+';
  for(let r=0;r<rocks.length;r++) {
    let block = rocks[r];
    for(let side=0;side<block.length-1;side++) {
      let startX, stopX, startY, stopY;
      if(block[side][0] === block[side+1][0]) {
        startX = block[side][0]-minX;
        stopX = block[side][0]-minX;
        startY = Math.min(block[side][1],block[side+1][1]);
        stopY = Math.max(block[side][1],block[side+1][1]);
      } else {
        startX = Math.min(block[side][0],block[side+1][0])-minX;
        stopX = Math.max(block[side][0],block[side+1][0])-minX;
        startY = block[side][1];
        stopY = block[side][1];
      }
      for(dy=startY;dy<=stopY;dy++) {
        for(dx=startX;dx<=stopX;dx++) {
          cave[dy][dx] = "#";
        }
      }
    }
  }
  let filled = 0;
  for(answer=-1;!filled;answer++) {
    let sand = [start,0];
    let stuck = 0;
    while(!filled&&!stuck) {
      if(cave[sand[1]+1][sand[0]] === '.') {
        sand[1]++;
      } else if(cave[sand[1]+1][sand[0]-1]==='.') {
        sand[1]++;
        sand[0]--;
      } else if(cave[sand[1]+1][sand[0]+1]==='.') {
        sand[1]++;
        sand[0]++;
      } else {
        cave[sand[1]][sand[0]] = 'o';
        stuck = 1;
      }
      if(sand[1]>=maxY) {
        filled = 1;
      }
    }

  }
  console.log(cave);
  console.log(answer);
});
