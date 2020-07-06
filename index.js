const express = require('express');
const path = require('path');
const login = require("facebook-chat-api");
const fs = require("fs");
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const twoFactor = require('node-2fa');
//const google = require('google-get-sheet.js');
var app=express();
var fc_api;
var email;
var password;

app.use(express.static(path.join(__dirname, 'public')))
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
  
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/user_list', function (req, res) {
	let data=[];
	fromDir(path.join(__dirname, 'user'),/\.json$/,function(filename){
		data.push(path.basename(filename));
	});
	res.send(data);
});
app.post('/send', function (req, res) {
	var body = req.body;
	var pageid= body.pageid;
	var mess=body.mess;
	fc_api.sendMessage(mess, pageid);
	console.log("Send message to : "+pageid);
	res.send("ok");
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
		fc_api=api;
		fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
	});
});
app.post('/login2fa', function (req, res) {
  var body = req.body;
  email= body.email;
  password= body.password;
  var code = body.code;
  if(code>6){
		code=twoFactor.generateToken(code);
		console.log(code);
  }
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
		fc_api=api;
		fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
	});
});



//function


function fromDir(startPath,filter,callback){

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter,callback); //recurse
        }
        else if (filter.test(filename)) callback(filename);
    };
};
