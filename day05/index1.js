const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let stacks = [];
let cmd = [];

let p = 0;

eachLine(filename, function(line) {
  if(p === 0) {
    let a=line.length/4+1;
    for(let i=0;i<a;i++) {
      stacks[i] = [];
    }
    p++;
  }
  if(p === 1) {
    let i = -1;
    let m = 0;
    while((i = line.indexOf("[",i+1)) !== -1) {
      m++;
      let a = Math.floor(i/4)+1;
      let c = line.charAt(i+1);
      stacks[a].push(c);
    }
    if(m === 0) {
      p++;
    }
  }
  if(p === 2) {
    if(line.indexOf("move")!== -1) {
      let ins = line.split(" ");
      let num = parseInt(ins[1]);
      let from = parseInt(ins[3]);
      let to = parseInt(ins[5]);
      cmd.push([num,from,to]);
    }
  }
}).then(function(err) {
  console.log(stacks);
  console.log(cmd);
  for(let i=0;i<cmd.length;i++) {
    let work = [];
    for(let b=0;b<cmd[i][0];b++) {
      work.push(stacks[cmd[i][1]].shift());
    }
    stacks[cmd[i][2]] = work.concat(stacks[cmd[i][2]]);
  }
  answer = "";
  for(let j=1;j<stacks.length;j++) {
    answer += stacks[j].shift();
  }
  console.log(answer);
});
