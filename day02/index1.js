const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let rounds = [];

eachLine(filename, function(line) {
  let letters = line.split(" ");
  let winScore = 0;
  switch(letters[0]) {
    case 'A':
      switch(letters[1]) {
        case 'X': winScore = 0 + 3; break;
        case 'Y': winScore = 3 + 1; break;
        case 'Z': winScore = 6 + 2; break;
        default: console.log("Also bad!"); break;
      }
      break;
    case 'B':
      switch(letters[1]) {
        case 'X': winScore = 0 + 1; break;
        case 'Y': winScore = 3 + 2; break;
        case 'Z': winScore = 6 + 3; break;
        default: console.log("Also bad!"); break;
      }
      break;
    case 'C':
      switch(letters[1]) {
        case 'X': winScore = 0 + 2; break;
        case 'Y': winScore = 3 + 3; break;
        case 'Z': winScore = 6 + 1; break;
        default: console.log("Also bad!"); break;
      }
      break;
    default:
      console.log("bad!");
      break;
  }
  //console.log(letters);
  //console.log(winScore);
  rounds.push(winScore);
}).then(function(err) {
  //console.log(rounds);
  answer = rounds.reduce((a,b)=>a+b);
  console.log(answer);
});
