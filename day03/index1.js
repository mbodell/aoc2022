const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let n = 0;

let lines = [];

eachLine(filename, function(line) {
  if(n<2) {
    lines[n] = line;
    n++;
  } else {
    let pri = 0;
    for(let i=0;i<line.length&&pri===0;i++) {
      if(lines[0].indexOf(line[i])!== -1&&lines[1].indexOf(line[i])!==-1) {
        pri = line[i].charCodeAt(0)-'a'.charCodeAt(0)+1;
        if(pri<0) {
          pri = line[i].charCodeAt(0)-'A'.charCodeAt(0)+27;
        }
      }
    }
    answer += pri;
    n = 0;
  }
}).then(function(err) {
  console.log(answer);
});
