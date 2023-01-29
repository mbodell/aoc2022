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
  // Unvisited, current node, path to date, minutes used, total flow, current rate
  let item = [[...realNodes],"AA",["AA"],0,0,0];
  console.log(item[2]);
  console.log("array?");
  item[0].shift();
  consider.push(item);
  console.log(consider);
  while(consider.length > 0) {
    item = consider.pop();
    let total = item[4] + (30-item[3])*item[5];
    if(total > maxFlow) {
      maxFlow = total;
      bestPath = item[2];
      console.log(`New max flow of ${maxFlow} from ${bestPath}`);
    }
    for(let i=0; i<item[0].length; i++) {
      let next = item[0][i];
      let unv = item[0].filter(f=>f!==next);
      let advT = adj[item[1]][next]+1;
      if( (item[3]+advT) < 30) {
        let path = [...item[2]];
        path.push(next);
        consider.push([unv,next,path,item[3]+advT,item[4]+advT*item[5],item[5]+valves[next].flow]);
      } else {
        total = item[4] + (30-item[3])*item[5];
        if(total > maxFlow) {
          maxFlow = total;
          bestPath = item[2];
          console.log(`New max flow of ${maxFlow} from ${bestPath}`);
        }
      }
    }
  }
  answer = maxFlow;
  console.log(answer);

});
