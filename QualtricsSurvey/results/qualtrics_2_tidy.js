console.log("running node script");
("use strict");

const fs = require("fs");


//connecting to qualtrics

// userID = UR_3Uz2uKRX4fXmzjL
// API token = 6D0Db2WUGcLp8KLOKA6xOcr4T4k4r3zKucbAtPvZ
// data center = sjc1
// survey id = SV_0dElEHvgMw0cxRs


//api call : https://{UR_3Uz2uKRX4fXmzjL}.qualtrics.com/API/V3/pathToRequest

// client name: Carolina Nobre
// client id: 2ec31b07343bdcb00ae882f43ef4a76b
// client secret: uc9pw8vEi1WVFCUHBNw8jw7Yy7WoYYvSpsptI9nLZhLzd5GJSnoPOuObctOo3wvp

// curl -X POST -H 'X-API-TOKEN:6D0Db2WUGcLp8KLOKA6xOcr4T4k4r3zKucbAtPvZ' -H 'Content-Type: application/json' -d '{

//     "surveyId": "SV_0dElEHvgMw0cxRs",

//     "format": "csv"

// }' 'https://2ec31b07343bdcb00ae882f43ef4a76b.qualtrics.com/API/v3/responseexports'



(async function() {
  let mode = process.argv[2];
  console.log("mode is ", mode);
  switch (mode) {
    case "scatter":
        processQualtrics("qualtrics_raw/STUDY/complete_study_scored.csv",mode);
      break;
    case "upset":
      await processQualtrics("qualtrics_raw/STUDY/upset/inProgress.csv",mode);
      break;
    case "fetchProvenance":
      await fetchProvenance();
      break;
    case "process":
      processData();
      break;
    case "provenance":
      processProvenance();
      break;
    case "visProvenance":
         //exportTidyProvenance();

          processVisProvenance();
          break;
    case "export":
      exportResults();
      break;
  }
})();

//function to filter out only valid participants;
function isValidParticipant(d) {
  let rejected = [
    { id: "5d00163d9f497e00191a609c", reason: "NOCODE", vis: "nodeLink" },
    { id: "5d49f4637df55600014dda45", reason: "NOCODE", vis: "nodeLink" },
    { id: "5c12d0d303f44c00017441e3", reason: "NOCODE", vis: "nodeLink" },
    { id: "5c5629c79fcbc40001dc55cc", reason: "NOCODE", vis: "nodeLink" },
    { id: "5d37d2861566530016a061de", reason: "LowEffort", vis: "nodeLink" },
    { id: "5d017f2466581d001a9059dc", reason: "NOCODE", vis: "nodeLink" },
    { id: "5d30e6ef53416100199ad7bf", reason: "NOCODE", vis: "nodeLink" },
    { id: "5d4c50d3ff031f001883cf4f", reason: "NOCODE", vis: "nodeLink" },
    { id: "5b74656b9750540001f26fde", reason: "NOCODE", vis: "nodeLink" },

    { id: "5d63dc6c163b260001acc8e6", reason: "NOCODE", vis: "adjMatrix" },
    { id: "5b2486c6007d870001c795a4", reason: "LowEffort", vis: "adjMatrix" },
    { id: "5c582efbe66e510001eedfa8", reason: "NOCODE", vis: "adjMatrix" },
    { id: "5c5043028003d4000107b97a", reason: "NOCODE", vis: "adjMatrix" },
    { id: "5d017f2466581d001a9059dc", reason: "NOCODE", vis: "adjMatrix" },
    { id: "5d36060877dd7c00197477e7", reason: "NOCODE", vis: "adjMatrix" },
    { id: "5d641c307c4e9c0019d604d8", reason: "LowEffort", vis: "adjMatrix" },
    { id: "5c1d19c810677f0001d9d56c", reason: "NOCODE", vis: "adjMatrix" },
    { id: "5ac393cf0527ba0001c2043c", reason: "LowEffort", vis: "adjMatrix" },
    { id: "5c6cf98a34d8f80001ddf31d", reason: "NOCODE", vis: "adjMatrix" }
  ];

  let invalid = [
    { id: "5d54d0b14a1521001850610a", reason: "TIMED OUT", vis: "nodeLink" },
    { id: "5caa534a19731a00190bb935", reason: "TIMED OUT", vis: "adjMatrix" },
    { id: "5d5c49acdd90af0001f13f7d", reason: "TIMED OUT", vis: "adjMatrix" },
    { id: "5b3d79ec4915d00001828240", reason: "RETURNED", vis: "adjMatrix" },
    { id: "5bfaed16e2562a0001ce0ff4", reason: "TIMED OUT", vis: "nodeLink" },
    { id: "5d645bf6912c630018e269e3", reason: "TIMED OUT", vis: "nodeLink" }
  ];

  let wasRejected = rejected.find(r => r.id === d.id);

  let invalidParticipant = invalid.find(r => r.id === d.id);

  return (
    d.data.mode === "study" &&
    d.id[0] === "5" &&
    d.data.demographics &&
    !wasRejected &&
    !invalidParticipant
  );
}

function processQualtrics(dataFile,visualization){
    const csv = require("csv-parser");
  
    let data = [];

    
  
    fs.createReadStream(dataFile) 
      .pipe(csv())
      .on("data", row => {
        data.push(row);
      })
      .on("end", () => {

        data.shift();
        data.shift();
        
        switch (visualization) {
            case "scatter":
                exportScatter(data)
              break;
            case "upset":
                exportUpset(data)
              break;
        }

        // exportTidy(data)
      });
  }



async function exportScatter(data) {
  const createCsvWriter = require("csv-writer").createObjectCsvWriter;
  let csvWriter;

  rHeaders = [
    "prolificId",
    "task",
    "literacy",
    "hard",
    "complexity",
    "condition",
    "vis",
    "measure",
    "value"
  ];

  csvWriter = createCsvWriter({
    path: "TidyR.csv",
    header: rHeaders.map(key => {
      return { id: key, title: key };
    })
  });

  rRows = [];

  //remove the first two rows which contain metadata 
//   data.shift();
//   data.shift();

  let questionsKeys = ['Knowledge', 'Comprehension', 'Application', 'Analysis', 'Synthesis','Evaluation'];

  //Important Keys
  //Visualization_Page Submit - time spent on video/static vis page.

  let scoreKeys = ['Knowledge','Application','Knowledge 2'];
  let qualKeys = ['Complexity - Unclear', 'Comp - Summary', 'Comp - Takeaway', 'Analysis', 'Synthesis AR', 'Evaluation','Trust - Explanation','S10']
  let quantKeys  = ['Complexity','Trust','Visual Literacy','Understanding', 'Animation 1','Animation 2','S2','S3','S4','S5','S6','S7','S8','S9']
//   let categoricalKeys = ['Visual Literacy','Understanding', 'Animation','Animation - 2','S2','S3','S4','S5','S6','S7','S8','S9']

  //Complexity  remove non numbers (such as (not complex at all))

  let allKeys = Object.keys(data[0]);
  let timingKeys = allKeys.filter(k=>k.includes('_Page Submit'))

  console.log(data[0])

  data.map(d => {
    //   console.log('id', d.PROLIFIC_PID)
    let prolificId = d.PROLIFIC_PID 
    let condition = d.CONDITION  // Math.random() > 0.5 ? 'static' : 'animated' //d.Condition
    let vis = d.Visualization
    let literacy = d["Visual Literacy_text"]
    let hard = d["Understanding_text"]
    let complexity = d["Complexity"]
    // console.log(condition)
    
    let createTidyRow = function(task,measure, value) {
        return {
          prolificId,
          task,
          condition,
          vis,
          literacy,
          hard,
          complexity,
          measure,
          value
        };
      };

    scoreKeys.map(key=>{
        rRows.push(createTidyRow(key,"answer", d[key]));
        rRows.push(createTidyRow(key,"accuracy",d[key+'_Score'] ));
        // rRows.push(createTidyRow(key,"accuracy", computeAccuracy(key,d[key])));
        rRows.push(createTidyRow(key,"time", d[key+'_Page Submit']));
    })

    quantKeys.map(key=>{
        rRows.push(createTidyRow(key,"value",d[key] ));     //d[key].replace(/\D/g,'')
    })

    // categoricalKeys.map(key=>{
    //     rRows.push(createTidyRow(key,"option", d[key]));     
    // })
    // timingKeys.map(key=>{

    //     let time = d[key]/60

    //     // rRows.push(createTidyRow("accuracy", Math.random()));
    //     rRows.push(createTidyRow(key,"time", time));

        
    //     // rRows.push(createTidyRow("answer", d[task]));
    //     // rRows.push(createTidyRow("time", d[key+'_Page Submit']));


    // })
   

    



    //   console.log('d', d)
  })
//   data.map(d => {
//     let id = participantData.data.workerID;

//     Object.keys(participantData.data)
//       .filter(key => key[0] === "S") //only look at task keys
//       .map(taskId => {
//         let createTidyRow = function(measure, value, customTaskId) {
//           let hypothesis = data.hypothesis.split(",");
//           return {
//             prolificId: id,
//             taskId: customTaskId ? customTaskId : taskId,
//             taskNumber: customTaskId ? 'T' + customTaskId.replace('S-task','') : 'T' + taskId.replace('S-task','')  ,
//             taskOrder:data.order,
//             taskTitle: taskTitles[taskId],
//             taskPrompt: customTaskId ? (customTaskId.includes('A') ? taskPrompts[taskId].split('.')[0]  : taskPrompts[taskId].split('.')[1] ) : taskPrompts[taskId],
//             visType: data.visType,
//             taskType: data.taxonomy.type,
//             topology: data.taxonomy.target,
//             node_attributes:data.attributes.node,
//             edge_attributes:data.attributes.edge,
//             attributes:data.attributes.node + data.attributes.edge,
//             hypothesis_1: hypothesis[0],
//             hypothesis_2: hypothesis[1] ? hypothesis[1] : "",
//             measure,
//             value
//           };
//         };

//         let data = participantData.data[taskId];

//         //create a row for every relevant value;
//         data.answer.nodes
//           .split(";")
//           .map(n => n.trim())
//           .map(node => {
//             rRows.push(createTidyRow("nodeAnswer", node));
//           });

//         data.answer.value
//           .split(";")
//           .map(n => n.trim())
//           .map(v => {
//             if (v.length > 0) {
//               v = v.replace(/,/g, "");
//               v = v.replace(/\r?\n|\r/g, "");
//               rRows.push(createTidyRow("valueAnswer", v));
//             }
//           });

//         if (data.answer.radio) {
//           rRows.push(createTidyRow("valueAnswer", data.answer.radio));
//         }
//         if (taskId == "S-task12") {
//           rRows.push(
//             createTidyRow("accuracy", data.answer.scoreCluster, "S-task12A")
//           );
//           rRows.push(
//             createTidyRow("accuracy", data.answer.scoreAverage, "S-task12B")
//           );
//         }

//         rRows.push(createTidyRow("accuracy", data.answer.accuracy));
//         rRows.push(createTidyRow("correct", data.answer.correct));
//         rRows.push(createTidyRow("difficulty", data.feedback.difficulty));
//         rRows.push(createTidyRow("confidence", data.feedback.confidence));
//         rRows.push(createTidyRow("minutesOnTask", data.minutesOnTask));
//       });
//   });

  csvWriter
    .writeRecords(rRows)
    .then(() => console.log("TidyR.csv was written successfully"));
}

    //key of answer for Upset questions
let answers = {
    'K1':{"K1_1": 'Off',
    "K1_2": 'Off',
    "K1_3": 'On',
    "K1_4": 'Off',
    "K1_5": 'Off',
    "K1_6": 'Off',
    "K1_7": 'Off',
    "K1_8": 'Off',
    "K1_9": 'Off',
    "K1_10": 'Off',
    "K1_11": 'Off',
    "K1_12": 'Off',
    "K1_13": 'Off',
    "K1_14": 'Off',
    "K1_15": 'Off',
    "K1_16": 'Off',
    "K1_17": 'Off',
    "K1_18": 'Off',
    "K1_19": 'Off',
    "K1_20": 'Off'
    },
    'K2':{"K2_1": 'On',
    "K2_2": 'On',
    "K2_3": 'Off',
    "K2_4": 'Off',
    "K2_5": 'Off',
    "K2_6": 'On',
    "K2_7": 'On',
    "K2_8": 'On',
    "K2_9": 'Off',
    "K2_10": 'Off',
    "K2_11": 'On',
    "K2_12": 'Off',
    "K2_13": 'On',
    "K2_14": 'Off',
    "K2_15": 'Off',
    "K2_16": 'Off',
    "K2_17": 'Off',
    "K2_18": 'Off',
    "K2_19": 'Off',
    "K2_20": 'Off'
    },
    'K3':{"K3_1": 'Off',
    "K3_2": 'Off',
    "K3_3": 'Off',
    "K3_4": 'Off',
    "K3_5": 'Off',
    "K3_6": 'Off',
    "K3_7": 'Off',
    "K3_8": 'Off',
    "K3_9": 'Off',
    "K3_10": 'Off',
    "K3_11": 'Off',
    "K3_12": 'Off',
    "K3_13": 'Off',
    "K3_14": 'Off',
    "K3_15": 'Off',
    "K3_16": 'On',
    "K3_17": 'Off',
    "K3_18": 'On',
    "K3_19": 'Off',
    "K3_20": 'Off'
    },
    'K4':{"K4_1": 'Off',
    "K4_2": 'Off',
    "K4_3": 'Off',
    "K4_4": 'Off',
    "K4_5": 'Off',
    "K4_6": 'Off',
    "K4_7": 'Off',
    "K4_8": 'Off',
    "K4_9": 'Off',
    "K4_10": 'Off',
    "K4_11": 'Off',
    "K4_12": 'Off',
    "K4_13": 'Off',
    "K4_14": 'Off',
    "K4_15": 'Off',
    "K4_16": 'Off',
    "K4_17": 'Off',
    "K4_18": 'Off',
    "K4_19": 'Off',
    "K4_20": 'Off'
    },
    'K5':{"K5_1": 'On',
    "K5_2": 'On',
    "K5_3": 'On',
    "K5_4": 'On',
    "K5_5": 'Off',
    "K5_6": 'Off'
    }
}

async function exportUpset(data) {
    const createCsvWriter = require("csv-writer").createObjectCsvWriter;
    let csvWriter;

  
    rHeaders = [
      "prolificId",
      "task",
      "literacy",
      "hard",
      "complexity",
      "condition",
      "vis",
      "measure",
      "value"
    ];
  
    csvWriter = createCsvWriter({
      path: "TidyR_upset.csv",
      header: rHeaders.map(key => {
        return { id: key, title: key };
      })
    });
  
    rRows = [];


  let allKeys = Object.keys(data[0]);

    //Important Keys
    //Visualization_Page Submit - time spent on video/static vis page.
  
    let scoreKeys = ['K1','K2','K3','K4','K5'];
    let qualKeys = ['Complexity - Unclear', 'Comp - Summary', 'Comp - Takeaway', 'Analysis', 'Synthesis AR', 'Evaluation','Trust - Explanation','S10']
    let quantKeys  = ['Complexity','Trust','Visual Literacy','Understanding', 'Animation 1','Animation 2','S2','S3','S4','S5','S6','S7','S8','S9']
  //   let categoricalKeys = ['Visual Literacy','Understanding', 'Animation','Animation - 2','S2','S3','S4','S5','S6','S7','S8','S9']
  
    //Complexity  remove non numbers (such as (not complex at all))
  
    
    let timingKeys = allKeys.filter(k=>k.includes('_Page Submit'))
  
    // console.log(data[0])

 
  
    data.map(d => {
      //   console.log('id', d.PROLIFIC_PID)
      let prolificId = d.PROLIFIC_PID 
      let condition = d.CONDITION  // Math.random() > 0.5 ? 'static' : 'animated' //d.Condition
      let vis = d.Visualization
      let literacy = d["Visual Literacy_text"]
      let hard = d["Understanding_text"]
      let complexity = d["Complexity"]
      // console.log(condition)
      
      let createTidyRow = function(task,measure, value) {
          return {
            prolificId,
            task,
            condition,
            vis,
            literacy,
            hard,
            complexity,
            measure,
            value
          };
        };
    

  
      scoreKeys.map(key=>{


        //   rRows.push(createTidyRow(key,"answer", d[key]));
        //   rRows.push(createTidyRow(key,"accuracy",d[key+'_Score'] ));
          let barOptions = Object.keys(answers[key]);
          barOptions.map(bar=>{
              if (d[bar]=='On'){
                rRows.push(createTidyRow(key,"selection", bar));    
              }
          })
        //   console.log('barOptions for ', key, 'are ', barOptions)
          rRows.push(createTidyRow(key,"accuracy", computeAccuracy(key,d)));
          rRows.push(createTidyRow(key,"time", d[key+'_Page Submit']/60));
      })
  
    //   quantKeys.map(key=>{
    //       rRows.push(createTidyRow(key,"value",d[key] ));     //d[key].replace(/\D/g,'')
    //   })
  
    })
  
  
    csvWriter
      .writeRecords(rRows)
      .then(() => console.log("TidyR.csv was written successfully"));
  }


function computeAccuracy(taskID, answerObj) {
  //dictionary of functions that compute the accuracy for each task; Each function
  // returns a score between 0 and 1
    //remove 0s from answer; 
  
    // let answers = {
    //     'K1':{"K1_1": 'Off',
    //     "K1_2": 'Off',
    //     "K1_3": 'On',
    //     "K1_4": 'Off',
    //     "K1_5": 'Off',
    //     "K1_6": 'Off',
    //     "K1_7": 'Off',
    //     "K1_8": 'Off',
    //     "K1_9": 'Off',
    //     "K1_10": 'Off',
    //     "K1_11": 'Off',
    //     "K1_12": 'Off',
    //     "K1_13": 'Off',
    //     "K1_14": 'Off',
    //     "K1_15": 'Off',
    //     "K1_16": 'Off',
    //     "K1_17": 'Off',
    //     "K1_18": 'Off',
    //     "K1_19": 'Off',
    //     "K1_20": 'Off'
    //     },
    //     'K2':{"K2_1": 'On',
    //     "K2_2": 'On',
    //     "K2_3": 'Off',
    //     "K2_4": 'Off',
    //     "K2_5": 'Off',
    //     "K2_6": 'On',
    //     "K2_7": 'On',
    //     "K2_8": 'On',
    //     "K2_9": 'Off',
    //     "K2_10": 'Off',
    //     "K2_11": 'On',
    //     "K2_12": 'Off',
    //     "K2_13": 'On',
    //     "K2_14": 'Off',
    //     "K2_15": 'Off',
    //     "K2_16": 'Off',
    //     "K2_17": 'Off',
    //     "K2_18": 'Off',
    //     "K2_19": 'Off',
    //     "K2_20": 'Off'
    //     },
    //     'K3':{"K3_1": 'Off',
    //     "K3_2": 'Off',
    //     "K3_3": 'Off',
    //     "K3_4": 'Off',
    //     "K3_5": 'Off',
    //     "K3_6": 'Off',
    //     "K3_7": 'Off',
    //     "K3_8": 'Off',
    //     "K3_9": 'Off',
    //     "K3_10": 'Off',
    //     "K3_11": 'Off',
    //     "K3_12": 'Off',
    //     "K3_13": 'Off',
    //     "K3_14": 'Off',
    //     "K3_15": 'Off',
    //     "K3_16": 'On',
    //     "K3_17": 'Off',
    //     "K3_18": 'On',
    //     "K3_19": 'Off',
    //     "K3_20": 'Off'
    //     },
    //     'K4':{"K4_1": 'Off',
    //     "K4_2": 'Off',
    //     "K4_3": 'Off',
    //     "K4_4": 'Off',
    //     "K4_5": 'Off',
    //     "K4_6": 'Off',
    //     "K4_7": 'Off',
    //     "K4_8": 'Off',
    //     "K4_9": 'Off',
    //     "K4_10": 'Off',
    //     "K4_11": 'Off',
    //     "K4_12": 'Off',
    //     "K4_13": 'Off',
    //     "K4_14": 'Off',
    //     "K4_15": 'Off',
    //     "K4_16": 'Off',
    //     "K4_17": 'Off',
    //     "K4_18": 'Off',
    //     "K4_19": 'Off',
    //     "K4_20": 'Off'
    //     },
    //     'K5':{"K5_1": 'On',
    //     "K5_2": 'On',
    //     "K5_3": 'On',
    //     "K5_4": 'On',
    //     "K5_5": 'Off',
    //     "K5_6": 'Off'
    //     }
    // }

    let output = function(data,task) {

        let taskAnswer =  answers[task]
        let answerKeys = Object.keys(taskAnswer)

        let score = true;

        answerKeys.map(key=>{
           score =  score && data[key] == taskAnswer[key]  
        })

      return score ? 1 : 0
    }


  return output(answerObj,taskID);
}



function standardDeviation(values) {
  var avg = average(values);

  var squareDiffs = values.map(function(value) {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data) {
  var sum = data.reduce(function(sum, value) {
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}



function processVisProvenance() {
  let rawdata;

  rawdata = fs.readFileSync("results/study/JSON/processed_results.json");
  let results = JSON.parse(rawdata);

  let validParticipants = results.map(r=>r.data.workerID);

  let allProvenance={};

  let slimProvenance = {};

  var files =[...Array(56).keys()]
  files.map((n,i)=>{
    rawdata = fs.readFileSync("allProvenance/provenance_" + i + ".json");
  let provenance = JSON.parse(rawdata);

  provenance.filter(prov=>{
    let id = prov.id.split('_')[0];
    if (validParticipants.includes(id)){
      let task = prov.id.split('_')[1];
      if (allProvenance[id]){
        allProvenance[id][task] = prov;
        slimProvenance[id][task] = prov['data']['provGraphs'].map(e=>{
          if (e.event === 'sort'){
            //distinguish between sort on attribute and sort on person; 
            if (typeof e.sortKey == 'number'){
              return 'sort-matrix-col';
            }else {
              return 'sort-' + e.sortKey;
            }
          } else {
            return e.event
          }
          });
        
      

      } else {
        allProvenance[id]={};
        allProvenance[id].visType = prov['data']['provGraphs'][0].selections ? 'adjMatrix' : 'nodeLink'
        allProvenance[id][task] = prov;

        slimProvenance[id]={};
        slimProvenance[id].visType = prov['data']['provGraphs'][0].selections ? 'adjMatrix' : 'nodeLink'
        slimProvenance[id][task] = prov['data']['provGraphs'].map(e=>{
          if (e.event === 'sort'){
            //distinguish between sort on attribute and sort on person; 
            if (typeof e.sortKey == 'number'){
              return 'sort-matrix-col';
            }else {
              return 'sort-' + e.sortKey;
            }
          } else {
            return e.event
          }
          });
        
      }
    };
  })

  })


  fs.writeFileSync(
    "results/study/JSON/slimProvenance.json",
    JSON.stringify(slimProvenance)
  );

};


function exportTidyProvenance(){

  let rawdata;
  rawdata = fs.readFileSync("results/study/JSON/slimProvenance.json");
  let slimProvenance = JSON.parse(rawdata);

  //Read in JSON file for slimProvenance; 

    //write out provenance events for R processing
    const createCsvWriter = require("csv-writer").createObjectCsvWriter;
    let csvWriter;

    headers = ['id','taskId','visType','event'];

    csvWriter = createCsvWriter({
      path: "results/study/CSV/provenanceTidy.csv",
      header: headers.map(key => {
        return { id: key, title: key };
      })
    });

    let provCsv = [];
    // "5d49e0634aff6e0018fb7004": {
    //   "visType": "adjMatrix",
    //   "S-task08": [null, "search", "c

    Object.keys(slimProvenance).map(id=>{
      Object.keys(slimProvenance[id]).map(taskId=>{
        if (Array.isArray(slimProvenance[id][taskId])){
          slimProvenance[id][taskId].map(event=>{
            if (event){
              provCsv.push({
                id,
                taskId,
                visType:slimProvenance[id].visType,
                event
              })
            }
          })
        }
      })
    })

    csvWriter
      .writeRecords(provCsv)
      .then(() => console.log("provenanceTidy.csv was written successfully"));
  

  

}
function processProvenance() {
  let rawdata;
  rawdata = fs.readFileSync("results/events.json");
  let eventTypes = JSON.parse(rawdata);

  rawdata = fs.readFileSync("results/study/JSON/processed_results.json");
  let results = JSON.parse(rawdata);

  rawdata = fs.readFileSync("results/study/JSON/study_participants.json");
  let study_participants = JSON.parse(rawdata);

  rawdata = fs.readFileSync("results/study/JSON/participant_actions.json");
  let provenance = JSON.parse(rawdata);

  //create events objects per participant;
  let events = [];

  provenance.map(participant => {
    participantEventArray = [];

    let r = results.find(r => r.data.workerID === participant.id);
    r.data.browsedAwayTime = 0;

    let p = study_participants.find(p => p.id === participant.id);

    participant.data.provGraphs.map(action => {
      //see if this a single event, or the start/end of a long event;
      let event = eventTypes[action.event];

      if (event && event.type === "singleAction") {
        //create copy of event template
        let eventObj = JSON.parse(JSON.stringify(eventTypes[action.event]));
        eventObj.label = action.event;
        eventObj.time = action.time;
        if (eventObj.label !== "next" && eventObj.label !== "back") {
          participantEventArray.push(eventObj);
        }
      } else {
        //at the start of an event;
        if (event && event.start.trim() == action.event.trim()) {
          let eventObj = JSON.parse(JSON.stringify(eventTypes[action.event]));
          eventObj.startTime = action.time;
          eventObj.task = action.task;

          //if this event started after the last task, ignore it;
          // if (Date.parse(eventObj.startTime)< Date.parse(r.data['S-task16'].startTime)){
          participantEventArray.push(eventObj);
          // }
        } else {
          //at the end of an event;
          //find the 'start' eventObj;
          let startObj = participantEventArray
            .filter(e => {
              let value =
                e.type === "longAction" &&
                Array.isArray(e.end) &&
                e.end.includes(action.event) &&
                (e.label === "task" ? e.task === action.task : true);
              return value;
            })
            .pop();
          if (startObj === undefined) {
            // console.log("could not find start event for ", action.event, action.task);
          } else {
            startObj.endTime = action.time;
            let minutesBrowsedAway =
              (Date.parse(startObj.endTime) - Date.parse(startObj.startTime)) /
              1000 /
              60;

            if (
              startObj.label === "browse away" &&
              startObj.task &&
              startObj.task[0] === "S"
            ) {
              //only adjust time for browse away events during task completions
              if (
                Date.parse(startObj.startTime) <
                Date.parse(r.data["S-task16"].endTime)
              ) {
                if (minutesBrowsedAway < 50) {
                  r.data.browsedAwayTime =
                    r.data.browsedAwayTime + minutesBrowsedAway;

                  //catch case where browse away is logged at several hours;
                  r.data[startObj.task].minutesOnTask =
                    Math.round(
                      (r.data[startObj.task].minutesOnTask -
                        minutesBrowsedAway) *
                        10
                    ) / 10;
                }
              }
            }
          }
        }
      }
    });

    //update total on study time
    r.data.overallMinutesOnTask =
      r.data.overallMinutesToComplete - r.data.browsedAwayTime;
    //update total on participant_info
    p.data.minutesOnTask = r.data.overallMinutesOnTask;

    events.push({ id: participant.id, provEvents: participantEventArray });
    // console.log(participantEventArray.filter(e=>e.type === 'longAction' && e.endTime === undefined))
  });

  // console.log(events)
  fs.writeFileSync(
    "results/study/JSON/provenance_events.json",
    JSON.stringify(events)
  );
  console.log("exported provenance_events.json");

  // console.log(events)
  fs.writeFileSync(
    "results/study/JSON/provenance_processed_results.json",
    JSON.stringify(results)
  );
  console.log("exported provenance_processed_results.json");

  // console.log(events)
  fs.writeFileSync(
    "results/study/JSON/provenance_study_participants.json",
    JSON.stringify(study_participants)
  );
  console.log("exported provenance_study_participants.json");
}

function flatten(data) {
  var result = {};
  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l == 0) result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
}

function nameSpace(obj, path) {
  var property,
    path = path.split(".");
  while ((property = path.shift())) {
    if (typeof obj[property] === "undefined") return undefined;
    obj = obj[property];
  }
  return obj;
}

function setNested(obj, path, value) {
  var property,
    path = path.split(".");
  while ((property = path.shift())) {
    if (typeof obj[property] === "undefined") {
      if (path.length > 0) {
        obj[property] = {};
      }
    }

    if (path.length === 0) {
      obj[property] = value;
    } else {
      obj = obj[property];
    }
    // console.log(obj,property,obj[property])
  }
}
