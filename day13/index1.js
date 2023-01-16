const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let packets = [];
let p = 0;
let left, right;
let cor = [];

function compare(l,r) {
  if(!Array.isArray(l) && !Array.isArray(r)) {
    if(l<r) {
      return -1;
    } else if (l===r) {
      return 0;
    } else {
      return 1;
    }
  }
  if(!Array.isArray(l) && Array.isArray(r)) {
    return compare([l], r);
  }
  if(Array.isArray(l) && !Array.isArray(r)) {
    return compare(l, [r]);
  }
  let len = Math.min(l.length, r.length);
  let ret = 0;
  for(let i=0;i<len&&ret===0;i++) {
    ret = compare(l[i],r[i]);
  }
  if(ret !== 0) {
    return ret;
  } else {
    if(l.length < r.length) {
      return -1;
    } else if(r.length < l.length) {
      return 1;
    } else {
      return 0;
    }
  }
}

eachLine(filename, function(line) {
  if(line.length>0) {
    packets.push(eval(line));
  }
}).then(function(err) {
  packets.push([[2]]);
  packets.push([[6]]);
  packets.sort((a,b)=>compare(a,b));
  let two = packets.findIndex(a=>(compare([[2]],a)===0))+1;
  let six = packets.findIndex(a=>(compare([[6]],a)===0))+1;
  answer = two*six;
  console.log(answer);
});
