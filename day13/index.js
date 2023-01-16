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
  switch(p) {
    case 0:
      left = eval(line);
      break;
    case 1:
      right = eval(line);
      packets.push([left,right]);
      break;
    case 2:
      p = -1;
      break;
  }
  p++;

}).then(function(err) {
  for(let ind=0;ind<packets.length;ind++) {
    left = packets[ind][0];
    right = packets[ind][1];
    let cmp = compare(left,right);
    if(cmp<0) {
      cor.push(ind+1);
    }
  }
  answer = cor.reduce((a,b)=>a+b);
  console.log(answer);
});
