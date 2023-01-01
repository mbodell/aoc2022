const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let ins = [];
let h = [0,0]
let t = [0,0];

eachLine(filename, function(line) {
  let i = line.split(" ");
  i[1] = parseInt(i[1]);
  ins.push(i);
}).then(function(err) {
  let visit = new Set();
  for(let i=0;i<ins.length;i++) {
    switch(ins[i][0]) {
      case 'R':
        for(let k=0;k<ins[i][1];k++) {
          h[0]++;
          if(h[0]-t[0]>1) {
            t[0]=h[0]-1;
            t[1]=h[1];
          }
          visit.add(`${t[0]},${t[1]}`);
        }
        break;
      case 'L':
        for(let k=0;k<ins[i][1];k++) {
          h[0]--;
          if(t[0]-h[0]>1) {
            t[0]=h[0]+1;
            t[1]=h[1];
          }
          visit.add(`${t[0]},${t[1]}`);
        }
        break;
      case 'U':
        for(let k=0;k<ins[i][1];k++) {
          h[1]++;
          if(h[1]-t[1]>1) {
            t[0]=h[0];
            t[1]=h[1]-1;
          }
          visit.add(`${t[0]},${t[1]}`);
        }
        break;
      case 'D':
        for(let k=0;k<ins[i][1];k++) {
          h[1]--;
          if(t[1]-h[1]>1) {
            t[0]=h[0];
            t[1]=h[1]+1;
          }
          visit.add(`${t[0]},${t[1]}`);
        }
        break;
      default:
        throw "bad";
        break;
    }
  }
  answer = visit.size;
  console.log(answer);
});
