const login = require("facebook-chat-api");
const fs = require("fs");
const credentials = {email: "100034201444354", password: "yeuvotao1198"};
const readline = require("readline");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
login(credentials, (err, api) => {
	if(err) {
        switch (err.error) {
            case 'login-approval':
                console.log('Enter 2FA > ');
                rl.on('line', (line) => {
                    err.continue(line);
                    rl.close();
                });
                break;
            default:
                console.error(err);
        }
        return;
    }
	console.log("Login!");
	fs.writeFileSync(credentials.email+'.json', JSON.stringify(api.getAppState()));
});