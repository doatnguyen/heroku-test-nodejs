const login = require("facebook-chat-api");
const fs = require("fs");

login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
	if(err) {
		console.error(err);
    }
	console.log("Login!");
	var yourID = "113943780012524";
    var msg = "Hey!";
    api.sendMessage(msg, yourID);
});