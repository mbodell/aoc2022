const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

eachLine(filename, function(line) {
  let ruckSize = line.length / 2;
  let pri = 0;
  for(let i=0;i<ruckSize&&pri===0;i++) {
    if(line.indexOf(line[i],ruckSize)!== -1) {
      pri = line[i].charCodeAt(0)-'a'.charCodeAt(0)+1;
      if(pri<0) {
        pri = line[i].charCodeAt(0)-'A'.charCodeAt(0)+27;
      }
    }
  }
  answer += pri;
}).then(function(err) {
  console.log(answer);
});
