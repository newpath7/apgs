# Auto-Populate Google Sheet (apgs)
Populate a Google Sheet with a script call for each row

## Installation
### Install dependencies
**npm install googleapis**

### Create Google App credentials
Login to console.cloud.google.com

Create a new project
 - From the Dashboard, enable apis and services 
 - Configure the App's OAuth Consent Screen (Registration)
     - Add sensitive scope Google Sheets API /auth/spreadsheets (the need to verify is for others to use this App, as in a production enivronment)
 - Configure Credentials
     - Create credential OAuth client id (Application type, Desktop app)
     - Download file and save as **credentials.json** in the apgs directory

### Configure with newspread.json
* sid = string - Spreadsheet ID 
* sn = integer - Position of sheet within spreadsheet to autopopulate (0 = first sheet, 1 = second sheet, 2 = third sheet, etc.) 
* newsid = string - Currently not used
* indexcolrng = string - A1 notation of range in sheet that has key values, to be used by getter script to get corresponding 
   rows (for example, "A2:A"  in a spread sheet where first column contains usernames and first row has header labels of worksheet)
* colequivals = array of strings - each element is like "shl=scrhl" where shl is the header label from the Google Spread 
   Sheet and scrhl is the header label from the getter script (the getter script function must return a javascript array representing the row)
 * f = string - Name of an asynchronous, one argument function in getter script that returns corresponding row of the key as an ordered array
 * fh = string - Name of zero argument function of getter script to return just ordered array of header fields
 * overwrite = boolean - False means that if a cell in the Google Sheets already has a value, then this value will not be overwritten 

### Run the app
**node index.js**

When running for the first time, an app authorization prompt will appear. 

After providing the information, a token.json file will be saved in the apgs directory and will be used in subsequent runs for authorization (without prompts).

Ths script creates a copy of the designated sheet and only works on that copy. By default, cells already containing something will not be overwritten. In the newspread.json file, set the "overwite" property to true to overwite cells even when they already contain something.
