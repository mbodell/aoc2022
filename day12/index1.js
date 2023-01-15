const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let grid = [];
let visit = [];
let path = [];
let start = [];
let end = [];
let w = 0;
let h = 0;

eachLine(filename, function(line) {
  if(w===0) {
    w = line.length;
  }
  grid[h++] = line.split("");
}).then(function(err) {
  console.log(`The width is ${w} and the height is ${h}`);
  for(let y=0;y<h;y++) {
    for(let x=0;x<w;x++) {
      let t = 0;
      switch(grid[y][x]) {
        case 'S':
          start = [y,x];
          grid[y][x] = 0;
          break;
        case 'E':
          end = [y,x];
          grid[y][x] = 25;
          break;
        default:
          grid[y][x] = grid[y][x].charCodeAt() - 'a'.charCodeAt();
          break;
      }
    }
  }
  let maxSize = h*w+1;
  console.log(`The start is ${start} and the end is ${end} and the maxSize is ${maxSize}`);
  visit = Array(h).fill().map(() => Array(w).fill(maxSize));
  path = Array(maxSize).fill().map(() => Array());
  path[0].push(end);
  visit[end[0]][end[1]] = 0;
  let solve = 0;
  for(let len=0;len<maxSize&&!solve;len++) {
    while(!solve && path[len].length > 0) {
      let loc = path[len].pop();
      visit[loc[0]][loc[1]] = len;
      if(grid[loc[0]][loc[1]]===0) {
        solve=1;
        answer = len;
      } else {
        let up = [loc[0]-1,loc[1]];
        let down = [loc[0]+1,loc[1]];
        let right = [loc[0],loc[1]+1];
        let left = [loc[0],loc[1]-1];
        let test = [up,down,right,left];
        while(!solve && test.length > 0) {
          let can = test.pop();
          if(can[0] >= 0 && can[0] < h &&
              can[1] >= 0 && can[1] < w &&
              visit[can[0]][can[1]] > len &&
              (grid[loc[0]][loc[1]] - grid[can[0]][can[1]]) <= 1) {
            if(path[len+1].length === 0 ||
               path[len+1].map((x) => (x[0]===can[0]&&x[1]===can[1])?1:0).reduce((a,b)=>a+b) === 0) {
              path[len+1].push(can);
            }
          }
        }
      }
    }
  }
  console.log(answer);
});
