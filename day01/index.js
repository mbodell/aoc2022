const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let curCount = 0;

eachLine(filename, function(line) {
  if (line === "") {
    if( curCount > answer) {
      answer = curCount;
    }
    curCount = 0;
  } else {
    curCount = curCount + parseInt(line);
  }

}).then(function(err) {

  console.log(answer);
});
