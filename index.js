const express = require('express');
const path = require('path');
const login = require("facebook-chat-api");
const fs = require("fs");
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
var app=express();
var email;
var password;

app.use(express.static(path.join(__dirname, 'public')))
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
// parse application/json 
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
app.post('/send', function (req, res) {
	var body = req.body;
	var pageid= body.pageid;
	var mess=body.mess;
	login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
		if(err) {
			res.send(err);
		}
		console.log("Login!");
		api.sendMessage(mess, pageid);
		res.send("ok");
	});
});
app.post('/login', function (req, res) {
  var body = req.body;
  email= body.email;
  password= body.password;
  var credentials = {email: email, password: password};
  console.log(credentials);
  login(credentials, (err, api) => {
		if(err) {
			switch (err.error) {
				case 'login-approval':
					res.send("Need 2fa");
                break;
            default:
                res.send(err);
        }
        return;
		}
		res.send("ok");
		console.log("Login!");
		fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
	});
});
app.post('/login2fa', function (req, res) {
  var body = req.body;
  email= body.email;
  password= body.password;
  var code = body.code-fa;
  var credentials = {email: email, password: password};
  console.log(credentials);
  login(credentials, (err, api) => {
		if(err) {
			switch (err.error) {
				case 'login-approval':
					err.continue(code);
                break;
            default:
                res.send(err);
        }
        return;
		}
		res.send("ok");
		console.log("Login!");
		fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
	});
});
