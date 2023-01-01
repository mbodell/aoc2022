const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let ins = [];
let h = [0,0]
let t = [0,0];
let pos = [];
let num = 10;

eachLine(filename, function(line) {
  let i = line.split(" ");
  i[1] = parseInt(i[1]);
  ins.push(i);
}).then(function(err) {
  for(let n=0;n<num;n++) {
    pos[n] = [0,0];
  }
  let s=0;
  let visit = new Set();
  for(let i=0;i<ins.length;i++) {
    switch(ins[i][0]) {
      case 'R':
        for(let k=0;k<ins[i][1];k++) {
          pos[0][0]++;
          for(let n=1;n<num;n++) {
            if((pos[n-1][0]-pos[n][0]>1) &&
               (pos[n-1][1]-pos[n][1]>1)) {
              pos[n][0]=pos[n-1][0]-1;
              pos[n][1]=pos[n-1][1]-1;
            } else if ((pos[n-1][0]-pos[n][0]>1) &&
                       (pos[n][1]-pos[n-1][1]>1)) {
              pos[n][0]=pos[n-1][0]-1;
              pos[n][1]=pos[n-1][1]+1;
            } else if ((pos[n][0]-pos[n-1][0]>1) && 
                       (pos[n-1][1]-pos[n][1]>1)) {
              pos[n][0]=pos[n-1][0]+1;
              pos[n][1]=pos[n-1][1]-1;
            } else if ((pos[n][0]-pos[n-1][0]>1) && 
                       (pos[n][1]-pos[n-1][1]>1)) {
              pos[n][0]=pos[n-1][0]+1;
              pos[n][1]=pos[n-1][1]+1;
            } else if(pos[n-1][0]-pos[n][0]>1) {
              pos[n][0]=pos[n-1][0]-1;
              pos[n][1]=pos[n-1][1];
            } else if(pos[n][0]-pos[n-1][0]>1) {
              pos[n][0]=pos[n-1][0]+1;
              pos[n][1]=pos[n-1][1];
            } else if(pos[n-1][1]-pos[n][1]>1) {
              pos[n][1]=pos[n-1][1]-1;
              pos[n][0]=pos[n-1][0];
            } else if(pos[n][1]-pos[n-1][1]>1) {
              pos[n][1]=pos[n-1][1]+1;
              pos[n][0]=pos[n-1][0];
            }
          }
          visit.add(`${pos[num-1][0]},${pos[num-1][1]}`);
        }
        break;
      case 'L':
        for(let k=0;k<ins[i][1];k++) {
          pos[0][0]--;
          for(let n=1;n<num;n++) {
            if((pos[n-1][0]-pos[n][0]>1) &&
               (pos[n-1][1]-pos[n][1]>1)) {
              pos[n][0]=pos[n-1][0]-1;
              pos[n][1]=pos[n-1][1]-1;
            } else if ((pos[n-1][0]-pos[n][0]>1) &&
                       (pos[n][1]-pos[n-1][1]>1)) {
              pos[n][0]=pos[n-1][0]-1;
              pos[n][1]=pos[n-1][1]+1;
            } else if ((pos[n][0]-pos[n-1][0]>1) && 
                       (pos[n-1][1]-pos[n][1]>1)) {
              pos[n][0]=pos[n-1][0]+1;
              pos[n][1]=pos[n-1][1]-1;
            } else if ((pos[n][0]-pos[n-1][0]>1) && 
                       (pos[n][1]-pos[n-1][1]>1)) {
              pos[n][0]=pos[n-1][0]+1;
              pos[n][1]=pos[n-1][1]+1;
            } else if(pos[n-1][0]-pos[n][0]>1) {
              pos[n][0]=pos[n-1][0]-1;
              pos[n][1]=pos[n-1][1];
            } else if(pos[n][0]-pos[n-1][0]>1) {
              pos[n][0]=pos[n-1][0]+1;
              pos[n][1]=pos[n-1][1];
            } else if(pos[n-1][1]-pos[n][1]>1) {
              pos[n][1]=pos[n-1][1]-1;
              pos[n][0]=pos[n-1][0];
            } else if(pos[n][1]-pos[n-1][1]>1) {
              pos[n][1]=pos[n-1][1]+1;
              pos[n][0]=pos[n-1][0];
            }
          }
          visit.add(`${pos[num-1][0]},${pos[num-1][1]}`);
        }
        break;
      case 'U':
        for(let k=0;k<ins[i][1];k++) {
          pos[0][1]++;
          for(let n=1;n<num;n++) {
            if((pos[n-1][0]-pos[n][0]>1) &&
               (pos[n-1][1]-pos[n][1]>1)) {
              pos[n][0]=pos[n-1][0]-1;
              pos[n][1]=pos[n-1][1]-1;
            } else if ((pos[n-1][0]-pos[n][0]>1) &&
                       (pos[n][1]-pos[n-1][1]>1)) {
              pos[n][0]=pos[n-1][0]-1;
              pos[n][1]=pos[n-1][1]+1;
            } else if ((pos[n][0]-pos[n-1][0]>1) && 
                       (pos[n-1][1]-pos[n][1]>1)) {
              pos[n][0]=pos[n-1][0]+1;
              pos[n][1]=pos[n-1][1]-1;
            } else if ((pos[n][0]-pos[n-1][0]>1) && 
                       (pos[n][1]-pos[n-1][1]>1)) {
              pos[n][0]=pos[n-1][0]+1;
              pos[n][1]=pos[n-1][1]+1;
            } else if(pos[n-1][0]-pos[n][0]>1) {
              pos[n][0]=pos[n-1][0]-1;
              pos[n][1]=pos[n-1][1];
            } else if(pos[n][0]-pos[n-1][0]>1) {
              pos[n][0]=pos[n-1][0]+1;
              pos[n][1]=pos[n-1][1];
            } else if(pos[n-1][1]-pos[n][1]>1) {
              pos[n][1]=pos[n-1][1]-1;
              pos[n][0]=pos[n-1][0];
            } else if(pos[n][1]-pos[n-1][1]>1) {
              pos[n][1]=pos[n-1][1]+1;
              pos[n][0]=pos[n-1][0];
            }
          }
          visit.add(`${pos[num-1][0]},${pos[num-1][1]}`);
        }
        break;
      case 'D':
        for(let k=0;k<ins[i][1];k++) {
          pos[0][1]--;
          for(let n=1;n<num;n++) {
            if((pos[n-1][0]-pos[n][0]>1) &&
               (pos[n-1][1]-pos[n][1]>1)) {
              pos[n][0]=pos[n-1][0]-1;
              pos[n][1]=pos[n-1][1]-1;
            } else if ((pos[n-1][0]-pos[n][0]>1) &&
                       (pos[n][1]-pos[n-1][1]>1)) {
              pos[n][0]=pos[n-1][0]-1;
              pos[n][1]=pos[n-1][1]+1;
            } else if ((pos[n][0]-pos[n-1][0]>1) && 
                       (pos[n-1][1]-pos[n][1]>1)) {
              pos[n][0]=pos[n-1][0]+1;
              pos[n][1]=pos[n-1][1]-1;
            } else if ((pos[n][0]-pos[n-1][0]>1) && 
                       (pos[n][1]-pos[n-1][1]>1)) {
              pos[n][0]=pos[n-1][0]+1;
              pos[n][1]=pos[n-1][1]+1;
            } else if(pos[n-1][0]-pos[n][0]>1) {
              pos[n][0]=pos[n-1][0]-1;
              pos[n][1]=pos[n-1][1];
            } else if(pos[n][0]-pos[n-1][0]>1) {
              pos[n][0]=pos[n-1][0]+1;
              pos[n][1]=pos[n-1][1];
            } else if(pos[n-1][1]-pos[n][1]>1) {
              pos[n][1]=pos[n-1][1]-1;
              pos[n][0]=pos[n-1][0];
            } else if(pos[n][1]-pos[n-1][1]>1) {
              pos[n][1]=pos[n-1][1]+1;
              pos[n][0]=pos[n-1][0];
            }
          }
          visit.add(`${pos[num-1][0]},${pos[num-1][1]}`);
        }
        break;
      default:
        throw "bad";
        break;
    }
  }
  answer = visit.size;
  console.log(answer);
});
