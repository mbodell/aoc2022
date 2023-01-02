const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let ins = [];
let regX = 1;
let cyc = 0;
let tim = 1;
let crt = [];
let row = -1;

eachLine(filename, function(line) {
  let i = line.split(" ");
  if(i.length > 1) {
    i[1] = parseInt(i[1]);
  }
  ins.push(i);
}).then(function(err) {
  console.log(ins);
  for(let i=0; i<ins.length; i++) {
    if((cyc%40)===0) {
      crt.push([]);
      row++;
    }
    let mid = cyc%40;
    if(mid===regX || mid===regX-1 || mid===regX+1) {
      crt[row].push("#");
    } else {
      crt[row].push(".");
    }
    cyc++;
    if((cyc%40)===20) {
      answer += cyc * regX;
      console.log(`Cycle ${cyc} and register is ${regX} so answer is ${answer}`);
    }
    if(ins[i][0] === "noop") {
      tim = 1;
    } else {
      if(tim === 1) {
        tim--;
        i--;
      } else {
        regX += ins[i][1];
        tim = 1;
      }
    }
  }
  console.log(answer);
  console.log(crt.map(a=>a.join("")));
});
