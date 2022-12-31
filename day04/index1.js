const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

eachLine(filename, function(line) {
  let e = line.split(",").map(s=>s.split("-").map(s=>parseInt(s)));
  if(e[0][0]<e[1][0] && e[0][1]<e[1][0]) {
  } else if (e[1][0]<e[0][0] && e[1][1]<e[0][0]) {
  } else {
    answer++;
  }
}).then(function(err) {
  console.log(answer);
});
