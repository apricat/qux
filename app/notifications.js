var config = require('../config');
var User = require('../dao/user');
var CronJob = require('cron').CronJob;
var gcm = require('node-gcm');

exports.execute = function(req, res) {

  // jobs --------------------------------------------------------------------
  new CronJob('* * * * *', function() {
    var users = [];
    User.find(function(err, users) {
      if (err)
        console.log(err);

        var regTokens = [];
        for (var i = 0; i < users.length; i++) {
          regTokens.concat(users[i].endpoints);
        }
    console.log(regTokens)
        var sender = new gcm.Sender(config.pushAuthKey);
        var message = new gcm.Message({
            data: { key1: 'msg1' }
        });
        sender.send(message, { registrationTokens: regTokens }, function (err, response) {
            if(err) console.error(err);
            else 	console.log(response);
        });
    });



  }, null, true, 'America/Los_Angeles');
}
