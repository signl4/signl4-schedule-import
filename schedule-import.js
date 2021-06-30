
const fetch = require('node-fetch');

const csv = require('csv-parser');
const fs = require('fs');
const { exit } = require('process');

const strAPIKey = 'YOUR-SIGNL4-API-KEY';
const strTeamName = 'Super SIGNL4';

// Command line arguments
const args = process.argv;

if (args.length < 3) {
  console.log('Please specify a .csv file as argument.');

  //exit();
}

//const strCSVPath = args[3];

const strCSVPath = 'C:\\Data\\Store\\Projects\\GitHub\\SIGNL4\\SIGNL4-Schedule-Import\\schedules.csv';

console.log('Reading .csv file: ' + strCSVPath);

// Run
importSchedules();

//var strTeamId =  getTeamId(strTeamName);
//console.log("Team ID: " + strTeamId);

// Main function
async function importSchedules() {

  // Get the team ID from the team name
  var strTeamId = await getTeamId(strTeamName);
  console.log("Team ID: " + strTeamId);

  // Create schedules
  readSchedules(strTeamId);
}

async function readSchedules(strTeamId) {
  // Read CSV file
  var strUserMail;
  var dateStart;
  var dateEnd;
  fs.createReadStream(strCSVPath)
    .on('error', (err) => {
      // Error
      console.log('Error reading file: ' + strCSVPath);
      exit();
    })  
    .pipe(csv())
    .on('data', (row) => {
      //console.log(row);

      strUserMail = row.Email;
      dateStart = row.Start;
      dateEnd = row.End;

      console.log(strUserMail + ', ' + dateStart + ', ' + dateEnd)

      if (strUserMail == 'DELETE') {
        // Delete schedule range
        deleteScheduleRange(strTeamId, dateStart, dateEnd);
      }
      else {
        // Create schedule
        createScheduleHelper(strTeamId, strUserMail, dateStart, dateEnd);
      }
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
  }

// Get the team ID from the team name
async function getTeamId(strTeamName) {
  var teamId = "";
  const res = await fetch('https://connect.signl4.com/api/teams', {
          method: 'get',
          headers: { 'X-S4-Api-Key': strAPIKey }
      });

      const json = await res.json();
      
      //console.log(json);

      // Get team id from team name
      json.forEach(function (item) {
        if (strTeamName == item.name) {
          console.log(item.name + ': ' + item.id);
          teamId = item.id;
        }
      });

    return teamId;
  }


// Get user ID from user email
async function getUserId(strMail) {
  var userId = "";
  const res = await fetch('https://connect.signl4.com/api/users', {
          method: 'get',
          headers: { 'X-S4-Api-Key': strAPIKey }
      })

      const json = await res.json();
      
      //console.log(json);

      // Get team id from team name
      json.forEach(function (item) {
        if (strMail.toLowerCase() == item.mail.toLowerCase()) {
          console.log(item.mail + ': ' + item.id);
          userId = item.id;
        }
      });

    return userId;
  }

// Create schedule from user email
async function createScheduleHelper(teamId, userEmail, start, end) {

      // Get user ID from user email
      var strUserId = await getUserId(userEmail);
      console.log("User ID: " + strUserId);

      createSchedule(teamId, strUserId, start, end)
}

// Create schedule
async function createSchedule(teamId, userId, start, end) {
  var dataSchedule = [{
    'id': '',
    'options': 0,
    'start': start,
    'end': end,
    'userId': userId
  }];
  const res = await fetch('https://connect.signl4.com/api/teams/' + teamId + '/schedules/multiple?overrideExisting=true', {
          method: 'post',
          body:    JSON.stringify(dataSchedule),
          headers: {
            'X-S4-Api-Key': strAPIKey,
            'overrideExisting': true,
            'Content-Type': 'application/json',
            'Accept': 'application/json' }
      });

      //const status = await res.statusText;
      //console.log(status);

      const json = await res.json();
      
      console.log(json);
  }

// Delete schedule range
async function deleteScheduleRange(teamId, start, end) {
  var dataSchedule = {
    'from': start,
    'to': end
  };
  const res = await fetch('https://connect.signl4.com/api/teams/' + teamId + '/schedules/deleteRange', {
          method: 'post',
          body:    JSON.stringify(dataSchedule),
          headers: {
            'X-S4-Api-Key': strAPIKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json' }
      });

      //const status = await res.statusText;
      //console.log(status);

      const json = await res.json();
      
      console.log(json);
  }
