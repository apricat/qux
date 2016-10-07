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

        var title = 'Qux quizz - A new question begs to be answered!'; 
        var message = question.text;  
        var icon = question.icon;  
        var notificationTag = 'tag tag';

        var actions = [];
        for (var i in question.answers.choices) {
          actions.push({ "action": question.answers.choices[i], "title": question.answers.choices[i], "icon": "images/yes.png" });
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

      var title = 'An error occurred';
      var message = 'We were unable to get the information for this push message';  
      var icon = 'images/icon.png';  
      var notificationTag = 'notification-error';  
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
  console.log('Notification click: tag', event.notification.tag);
  // Android doesn't close the notification when you click it
  // See http://crbug.com/463146
  event.notification.close();
  
  // TODO: go to notification
});