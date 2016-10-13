self.addEventListener('push', function(event) {
  // Since there is no payload data with the first version
  // of push messages, we'll grab some data from
  // an API and use it to populate a notification
  event.waitUntil(
    fetch("/api/questions").then(function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        throw new Error();
      }

      return response.json().then(function(data) {
        if (data.error || data.length < 1) {
          console.error('The API returned an error.', data.error);
          throw new Error();
        }

        var question = data[Math.floor(Math.random() * data.length)];

        var title = 'Qux quizz - A new question begs to be answered!',
            message = question.text,
            icon = question.icon ? question.icon : 'images/icon.png',
            notificationTag = 'qux quizz question',
            actions = [];

        for (var i in question.answers.choices) {
          var action = JSON.stringify({ userId: question.userId,  isCorrect: (i == question.answers.correct)});
console.log(action);
          actions.push({
              "action": action,
              "title": question.answers.choices[i],
              "icon": "images/answer-icon.png"
            });
        }

        return self.registration.showNotification(title, {
          body: message,
          icon: icon,
          tag: notificationTag,
          actions: actions
        });
      });

    }).catch(function(err) {
      console.error('Unable to retrieve data', err);

      var title = 'An error occurred',
          message = 'We were unable to get the information for this push message',
          icon = 'images/icon.png',
          notificationTag = 'notification-error';

      return self.registration.showNotification(title, {
          body: message,
          icon: icon,
          tag: notificationTag
        });
    })
  );
});

self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('notificationclick', function(event) {
var userId = 0;
console.log(event.action);

event.notification.close();
  var result = JSON.parse(event.action);

  if (result == null || result.isCorrect == null)
    return;

  if (result.isCorrect == "true") {  // for some reason, the event action boolean gets typecasted to a String within the event
    fetch('/api/user/'+userId+'/score/1', {
        method: 'put'
      }).then(function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' + response.status);
          throw new Error();
        }
    }).catch(function(err) {
      console.error('Unable to increment score', err);
    });

    var title = "+1",
        message = "Great answer!",
        icon = 'images/thumbs-up.png',
        notificationTag = 'success';

  } else if (event.action == "false") {

    var title = ":("
        message = "Bad answer",
        icon = 'images/thumbs-down.png',
        notificationTag = 'success';

  } else {
    return;
  }

  return self.registration.showNotification(title, {
      body: message,
      icon: icon,
      tag: notificationTag
    });
}, false);
