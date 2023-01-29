const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let valves = {};
let count = 0;

eachLine(filename, function(line) {
  let tokens = line.split(" ");
  let flow = Number(tokens[4].split("=")[1].split(";")[0]);
  let edges = tokens.slice(9).map(s=>[s.split(",")[0],1]);
  console.log(`For valve ${tokens[1]} the flow is ${flow} and the edges are ${edges}`);
  valves[tokens[1]] = {"flow": flow, "edges": edges};
  count++;
}).then(function(err) {
  Object.entries(valves).forEach(([k, v]) =>
    {
      if(k!== "AA" && v.flow === 0) {
        let s1 = v.edges[0][0];
        let s2 = v.edges[1][0];
        let len = v.edges[0][1] + v.edges[1][1];
        for(let i=0;i<valves[s1].edges.length;i++) {
          if(valves[s1].edges[i][0]===k) {
            valves[s1].edges[i][0] = s2;
            valves[s1].edges[i][1] += v.edges[1][1];
          }
        }
        for(let i=0;i<valves[s2].edges.length;i++) {
          if(valves[s2].edges[i][0]===k) {
            valves[s2].edges[i][0] = s1;
            valves[s2].edges[i][1] += v.edges[0][1];
          }
        }
      }
    });
  let realNodes = [];
  realNodes.push("AA");
  Object.entries(valves).forEach(([k, v])=>
      {
        console.log(`Node ${k} has flow of ${v.flow} with edges of ${v.edges}`);
        if(v.flow > 0) {
          realNodes.push(k);
        }
      });
  console.log(answer);
  console.log(realNodes);
  let adj = {};
  for(let i=0; i<realNodes.length; i++) {
    adj[realNodes[i]] = {};
    for(let j=0; j<realNodes.length; j++) {
      adj[realNodes[i]][realNodes[j]] = (i===j)?0:count;
    }
  }
  Object.entries(adj).forEach(([k, v])=>
      {
        console.log(`Node ${k} has distance of:`);
        Object.entries(v).forEach(([k1, v1])=>
          {
            console.log(`  ${k1}:${v1}`);
          });
      });
  for(let i=0; i<realNodes.length;i++) {
    let unvisited = [...realNodes];
    while(unvisited.length) {
      let minDist = count+1;
      let next;
      for(let j=0; j<unvisited.length; j++) {
        if(adj[realNodes[i]][unvisited[j]] < minDist) {
          next = unvisited[j];
          minDist = adj[realNodes[i]][unvisited[j]];
        }
      }
      let sides = valves[next].edges;
      for(let j=0; j<sides.length; j++) {
        if(adj[realNodes[i]][sides[j][0]] > minDist + sides[j][1]) {
          adj[realNodes[i]][sides[j][0]] = minDist + sides[j][1];
          adj[sides[j][0]][realNodes[i]] = minDist + sides[j][1];
        }
      }
      unvisited = unvisited.filter(a=>a!==next);
    }
  }
  console.log(`adj:`);

  Object.entries(adj).forEach(([k, v])=>
      {
        console.log(`Node ${k} has distance of:`);
        Object.entries(v).forEach(([k1, v1])=>
          {
            console.log(`  ${k1}:${v1}`);
          });
      });
  let maxFlow = 0;
  let bestPath;
  let consider = [];
  // Unvisited, current node you, current node e, path you to date, path e to date, minutes used, minutes used e, flow[]
  let item = [[...realNodes],"AA", "AA", ["AA:0"], ["AA:0"], 0,0,Array(26).fill(0)];
  console.log(item[2]);
  console.log("array?");
  item[0].shift();
  consider.push(item);
  console.log(consider);
  let countLoop = 0;
  while(consider.length > 0) {
    countLoop++;
    item = consider.pop();
    if(countLoop%10000===0) {
      console.log(`We have considered ${countLoop} possiblities, the best is ${maxFlow} and we have ${consider.length} to expand and ${item[0].length} is our next length`);
    }
    let total = item[7].reduce((a,b)=>a+b);
    if(total > maxFlow) {
      maxFlow = total;
      bestPath = [item[3],item[4]];
      console.log(`New max flow of ${maxFlow} from ${bestPath}`);
    }
    for(let i=0; i<item[0].length; i++) {
      let next = item[0][i];
      let unv = item[0].filter(f=>f!==next);
      let me = false;
      if(item[5]<item[6]) {
        me = true;
      }
      let advT = adj[(me?item[1]:item[2])][next]+1;
      let advA = Math.min(advT,Math.max(item[5],item[6])-Math.min(item[5],item[6]));
      if( ((me?item[5]:item[6])+advA) < 26) {
        let path = [...(me?item[3]:item[4])];
        path.push(next + ":" + (me?item[5]+advT:item[6]+advT));
        let flowR = [...item[7]];
        for(let j=0;j<flowR.length;j++) {
          if((me?item[5]:item[6])+advT<=j) {
            flowR[j] += valves[next].flow;
          }
        }
        consider.push([unv,(me?next:item[1]),(me?item[2]:next),(me?path:item[3]),(me?item[4]:path),(me?item[5]+advT:item[5]),(me?item[6]:item[6]+advT),flowR]);
      } else {
        total = item[7].reduce((a,b)=>a+b);
        if(total > maxFlow) {
          maxFlow = total;
          bestPath = [item[2],item[3]];
          console.log(`New max flow of ${maxFlow} from ${bestPath}`);
        }
      }
    }
  }
  answer = maxFlow;
  console.log(answer);

});
