/**
 * @license
 * Copyright Google Inc.
 *
 *  May 2021 - Modified by New Path <newpath7@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// [START sheets_quickstart]
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const config = JSON.parse(fs.readFileSync('newspread.json'));
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), autoPopulateSheet);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/*
 * Creates a new spreadsheet, populating it based on 
 * the newspread.json config file
 * The getter f function must be asynchronous, one string argument
 * The getter fh function must return a comma-separted list of fields
 */

async function autoPopulateSheet(auth) {
    const sheets = google.sheets({version: 'v4', auth });
    try {
    const response = (await sheets.spreadsheets.sheets.copyTo({
	spreadsheetId: config.sid,
	sheetId: config.sn,
	resource: {
	    destinationSpreadsheetId: config.sid,
	},
    }));
	const indices = (await sheets.spreadsheets.values.get({
		spreadsheetId: config.sid,
		range: response.data.title + '!' + config.indexcolrng,
	})).data;
		  const getter = require(config.jsfile);
	    let lvs = [];
	    let rvs = [];
	    let lrvs = [];
	    config.colequivals.forEach(function (v) {
		    let [lv, rv] = v.split("=");
		    lrvs[rv] = lv;
	    });
	    const sheetcols = (await sheets.spreadsheets.values.get({
		    spreadsheetId: config.sid,
		    range: response.data.title + '!' + '1:1',
	    })).data;
		sheetcols.values[0].forEach(function (m, i) {
			lvs[m] = i;
		});
		getter[config.fh]().forEach(function (m, i) {
			if (typeof lvs[lrvs[m]] !== 'undefined')
				rvs[i] = lvs[lrvs[m]];
		});
		let sheeti = 2;  /* first row must have header */
		  indices.values.forEach(async function f(un) {
		/* GET VALS */
		  	let gettmp = await getter[config.f](un);
   			let sheetrow = (await sheets.spreadsheets.values.get({
		           spreadsheetId: config.sid,
		           range: response.data.title + '!' + sheeti + ':' + sheeti,
		       })).data;
			rvs.forEach(function (m, i) {
					if (config.overwrite === false) {
							if (!sheetrow.values[0][m]) {
									sheetrow.values[0][m] = gettmp[i];
							}
					} else {
							sheetrow.values[0][m] = gettmp[i];
						}
			});
				sheets.spreadsheets.values.update({
						spreadsheetId: config.sid,
					range: response.data.title + '!' + sheeti + ':' + sheeti,
					valueInputOption: "USER_ENTERED",

					resource: { values: sheetrow.values}}, (err, result) => {
							if (err) {
									console.log(err);
							} else {
								console.log('.');
							}
					});
				  sheeti++;
			});
    } catch(err) {
	    console.log("Error reading spread sheet");
	console.error(err);
    }
}

module.exports = {
  SCOPES,
    autoPopulateSheet,  
};
