const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let root = [];
root.size = 0;
let current = root;

function findBest(arr, b, target) {
  if(Array.isArray(arr)) {
    if(arr.size >= target && arr.size < b) {
      b = arr.size;
    }
    for(let i=0;i<arr.length;i++) {
      b = findBest(arr[i],b,target);
    }
    return b;
  } else {
    return b;
  }
}

eachLine(filename, function(line) {
  if(line === "$ cd /") {
    current = root;
  } else if (line === "$ ls") {
  } else if (line === "$ cd ..") {
    let upSize = current.size;
    current = current.p;
    if(upSize <= 100000) {
      answer += upSize;
    }
    current.size += upSize;
  } else if (line.indexOf("$ cd")!==-1) {
    let dir = line.split(" ")[2];
    for(let i=0;i<current.length;i++) {
      if(current[i][1] === dir) {
        current = current[i][0];
        i = current.length+1;
      }  
    }
  } else {
    let f = line.split(" ");
    if(f[0] === "dir") {
      let a = [];
      a.p = current;
      a.size = 0;
      current.push([a,f[1]]);
    } else {
      let fsize = parseInt(f[0]);
      current.push(fsize,f[1]);
      current.size += fsize;
    }
  }
}).then(function(err) {
  while(current !== root) {
    let upSize = current.size;
    current = current.p;
    if(upSize <= 100000) {
      answer += upSize;
    }
    current.size += upSize;
  }
  //console.log(root);
  console.log(answer);
  let target = root.size - 40000000;
  let best = root.size;
  for(let i=0;i<root.length;i++) {
    best = findBest(root[i],best,target);
  }
  console.log(best);
});
