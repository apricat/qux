self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('push', function(event) {

  var question = {};
  
  var title = 'Qux quizz - A new question begs to be answered!';

  event.waitUntil(
    self.registration.showNotification(title, {
     body: question.text,
     icon: 'images/icon.png',
     tag: 'quizz',
     actions: [
      { "action": "yes", "title": "Yes", "icon": "images/yes.png" },
      { "action": "no", "title": "No", "icon": "images/no.png" }
    ]
   }));
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag', event.notification.tag);
  // Android doesn't close the notification when you click it
  // See http://crbug.com/463146
  event.notification.close();
  
  // TODO: go to notification
});