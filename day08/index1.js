const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let trees = [];

const UP = 1;
const DOWN = 2;
const LEFT = 4;
const RIGHT = 8;

eachLine(filename, function(line) {
  trees.push(line.split("").map(n=>parseInt(n)));
}).then(function(err) {
  let w = trees[0].length;
  let h = trees.length;
  let vis = Array.from(Array(h), _ => Array(w).fill(0));
  let vh = -1;
  let x = 0;
  let y = 0;

  for(x=0;x<h;x++) {
    for(vh=-1,y=0;y<w&&vh<9;y++) {
      if(trees[x][y]>vh) {
        vis[x][y] += UP;
        vh=trees[x][y];
      }
    }
    for(vh=-1,y=w-1;y>=0&&vh<9;y--) {
      if(trees[x][y]>vh) {
        vis[x][y] += DOWN;
        vh=trees[x][y];
      }
    }
  }
  for(y=0;y<w;y++) {
    for(vh=-1,x=0;x<h&&vh<9;x++) {
      if(trees[x][y]>vh) {
        vis[x][y] += LEFT;
        vh=trees[x][y];
      }
    }
    for(vh=-1,x=h-1;x>=0&&vh<9;x--) {
      if(trees[x][y]>vh) {
        vis[x][y] += RIGHT;
        vh=trees[x][y];
      }
    }
  }

  answer = vis.map(a=>a.map(n=>(n>0)?1:0).reduce((a,b)=>a+b)).reduce((a,b)=>a+b);
  console.log(answer);
  answer = 0;
  for(x=0;x<h;x++) {
    for(y=0;y<w;y++) {
      let th = trees[x][y];
      let up = 0;
      let down = 0;
      let right = 0;
      let left = 0;
      let cx=0;
      let cy=0;
      let g = 1;
      let prod = 0;
      for(cx=x-1;cx>=0&&g===1;cx--) {
        up++;
        if(trees[cx][y]>=th) {
          g=0;
        }
      }
      for(g=1,cx=x+1;cx<h&&g===1;cx++) {
        down++;
        if(trees[cx][y]>=th) {
          g=0;
        }
      }
      for(g=1,cy=y-1;cy>=0&&g===1;cy--) {
        right++;
        if(trees[x][cy]>=th) {
          g=0;
        }
      }
      for(g=1,cy=y+1;cy<w&&g===1;cy++) {
        left++;
        if(trees[x][cy]>=th) {
          g=0;
        }
      }
      prod = left*right*up*down;
      if(prod > answer) {
        answer = prod;
      }
    }
  }
  console.log(answer);

});
