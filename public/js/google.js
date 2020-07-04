
var SPREADSHEET_ID = '1GBgZ37ilREkT5uvSnJveJrX5_VgRTEWzMGuTlpuUaeA'; //from the URL of your blank Google Sheet
var CLIENT_ID = '390576415647-k0ciht0h32cg015ujos0ktpv5esf488p.apps.googleusercontent.com'; //from https://console.developers.google.com/apis/credentials
const API_KEY = 'AIzaSyCVS97nLAeldy9nNZ1JF0HFFit2c1-KEQM'; //https://console.developers.google.com/apis/credentials
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
var RANGE_CURSOR='data!B:B';
function readSheet(){
	SPREADSHEET_ID = $("#sheetID").val();
	RANGE_CURSOR=$("#sheet_page").val();
	gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE_CURSOR
    }).then((response) => {
        var data = JSON.parse(JSON.stringify(response));
		var numRows = data.result.values ? data.result.values.length : 0;
		if(numRows){
			let i;
			for (i = 0; i < data.result.values.length; i++) {
				addPageId(data.result.values[i]);
			}
			addLog("Đã Nhập "+numRows+" page");
		}else{
			addLog("Lỗi không nhận thông tin từ sheet");
		}
    });
}
function initClient() {

    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function() {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
	console.log(isSignedIn);
	/*
    if (isSignedIn) {
        writeSheet();
    }
	*/
}

function handleSignInClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}