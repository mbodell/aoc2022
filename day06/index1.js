const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

eachLine(filename, function(line) {
  let s = line.split("");
  let a = 13;
  let g = 0;
  for(a=13;a<s.length&&answer===0;a++) {
    for(let i=13;i>=0&&g===0;i--) {
      for(t=a-i+1;t<=a;t++) {
        if(s[t]===s[a-i]) {
          g=1;
        }
      }
    }
    if(g===0) {
      answer=a+1;
    } else {
      g=0;
    }
  }
}).then(function(err) {
  console.log(answer);
});
