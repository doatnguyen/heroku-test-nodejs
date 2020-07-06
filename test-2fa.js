var twoFactor = require('node-2fa');
 
var newSecret = twoFactor.generateSecret({name: 'My Awesome App', account: 'johndoe'});
var newToken = twoFactor.generateToken('PXHP6WGB54TRNEHXLCUPGOQUADCY2ZZD');

console.log(newToken.token);