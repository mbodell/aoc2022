const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let root = [];
let current = root;

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
  console.log(answer);
});
