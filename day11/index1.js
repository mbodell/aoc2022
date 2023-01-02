const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let monkeys = [];
let num = 0;
let gcd = 1;

eachLine(filename, function(line) {
  if(line === "") {
    num++;
  } else {
    let ins = line.split(":").map(a=>a.trim());
    let words = ins[0].split(" ");
    switch(words[0]) {
      case "Monkey":
        monkeys.push([]);
        monkeys[num].ins = 0;
        break;
      case "Starting":
        monkeys[num].items = ins[1].split(",").map(a=>parseInt(a));
        break;
      case "Operation":
        monkeys[num].op = ins[1].split("=")[1].trim().split(" ");
        if(monkeys[num].op[2]!=="old") {
          monkeys[num].op[2] = parseInt(monkeys[num].op[2]);
        }
        break;
      case "Test":
        monkeys[num].test = parseInt(ins[1].split(" ")[2]);
        gcd *= monkeys[num].test;
        break;
      case "If":
        if(words[1]==="true") {
          monkeys[num].t = parseInt(ins[1].split(" ")[3]);
        } else {
          monkeys[num].f = parseInt(ins[1].split(" ")[3]);
        }
        break;
    }
  }
}).then(function(err) {
  let round = 0;
  console.log(gcd);
  for(round=0;round<10000;round++) {
    if(round===1||round===20||(round%1000)===0) {
      console.log(`After round ${round}:`);
      for(let s=0;s<monkeys.length;s++) {
        console.log(`Monkey ${s} inspected items ${monkeys[s].ins} times.`);
        console.log(monkeys);
      }
    }
    for(let mon=0;mon<monkeys.length;mon++) {
      while(monkeys[mon].items.length>0) {
        monkeys[mon].ins++;
        let item = monkeys[mon].items.shift();
        if(monkeys[mon].op[1] === "+") {
          if(monkeys[mon].op[2] === "old") {
            item += item;
          } else {
            item += monkeys[mon].op[2];
          }
        } else {
          if(monkeys[mon].op[2] === "old") {
            item *= item;
          } else {
            item *= monkeys[mon].op[2];
          }
        }
        //item = Math.floor(item/3);
        item = item % gcd;
        if((item % monkeys[mon].test)===0) {
          monkeys[monkeys[mon].t].items.push(item);
        } else {
          monkeys[monkeys[mon].f].items.push(item);
        }
      }
    }
  }

  let active = monkeys.map(a=>a.ins).sort((a,b)=>b-a);
  answer = active[0]*active[1];
  console.log(answer);
});
