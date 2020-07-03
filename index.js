const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
var app=express();

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
app.post('/test', function (req, res) {
  var body = req.body;
  var email = body.email;
  var password = body.password;
  console.log(email+" "+password);
});