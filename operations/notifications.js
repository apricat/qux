var config = require('../config');
var User = require('../models/user');
var CronJob = require('cron').CronJob;
var gcm = require('node-gcm');

exports.execute = function(req, res) {

  // jobs --------------------------------------------------------------------
  new CronJob('* * * * *', function() {

    User.find(function(err, users) {
      if (err)
        console.error(err);

      if (shouldNotifyUser())
        return;

      for (i = 0; i < users.length; i++) {
        var sender = new gcm.Sender(config.pushAuthKey);
        var message = new gcm.Message({ data: { userId: users[i]._id } });

        sender.send(message, { registrationTokens: users[i].endpoints }, function (err, response) {
            if(err)
              console.error(err);
        });
      }
    });

  }, null, true, 'America/Toronto');
}

var shouldNotifyUser = function()
{
  return Math.floor(Math.random() * 6) + 1 != 1;
}
