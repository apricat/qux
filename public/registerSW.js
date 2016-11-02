// @TODO

function registerSW($http) {
  var endpoint = "";
  // init service worker
  if (!('serviceWorker' in navigator))
    return;

    navigator.serviceWorker.register('sw.js').then(function() {
        return navigator.serviceWorker.ready;
    }).then(function(reg) {
        reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {

          endpoint = sub.endpoint.substr(sub.endpoint.lastIndexOf('/') + 1);
// @TODO we seem to be always appending endpoints
          if (typeof user != 'undefined') {
            if (user.endpoints.indexOf(endpoint))
              return;

            user.endpoints.push(endpoint);
            $http.put('/api/users/' + userId, {endpoints : user.endpoints});
            return;
          }

          $http.get('/api/users/' + userId)
              .success(function(data) {
                if (user.endpoints.indexOf(endpoint))
                  return;

                user.endpoints.push(endpoint);
                $http.put('/api/users/' + userId, {endpoints : user.endpoints});
              })
              .error(function(data) {
                  console.error('Error: ' + data);
              });
        });
    }).catch(function(error) {
        console.error('Service Worker error', error);
    });

};
