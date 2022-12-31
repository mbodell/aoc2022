const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

eachLine(filename, function(line) {
  let s = line.split("");
  let a = 3;
  for(a=3;a<s.length&&answer===0;a++) {
    if(s[a-3]!==s[a-2] &&
       s[a-3]!==s[a-1] &&
       s[a-3]!==s[a] &&
       s[a-2]!==s[a-1] &&
       s[a-2]!==s[a] &&
       s[a-1]!==s[a]) {
      answer=a+1;
    }
  }
}).then(function(err) {
  console.log(answer);
});
