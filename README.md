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
     - Add sensitive scope Google Sheets API /auth/spreadsheets (need to verify is for others to use your App)
 - Configure Credentials
     - Create credential OAuth client id (Application type, Desktop app)
     - Download file and save as **credentials.json** in the apgs directory

### Configure with newspread.json
* sid = string - Spreadsheet ID 
* sn = integer - position of sheet within spreadsheet to autopopulate (0 = first sheet, 1 = second sheet) 
* indexcolrng = string - A1 notation of range in sheet that has key values, to be used by getter script to get corresponding 
   row (for example, "A2:A"  in a spread sheet where first column contains usernames and first has header labels of worksheet)
* colequivals = array of strings - each element is of the form "shl=scrhl" where shl is the header label from Google Spread 
   Sheet and scrhl is the header label from getter script (your script must output in CSV format, with first row having header labels)
 * f = string - name of one argument function of getter script to return corresponding row of a key
 * fh = string - name of zero argument function of your script to return just header fields
 * overwrite = boolean - false means that if a cell in the Google Sheets already has a value, then this value will not be overwritten 
   by whatever is returned from getter script

### Run the app
**node index.js**

When running for the first time, an app authorization prompt will appear. 

After providing the information, a token.json will be saved in the apgs directory and will be used in subsequent runs for authroization (without prompts).
