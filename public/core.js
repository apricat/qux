var app = angular.module("quxQuestions", []);

var userId = "581949cbad51f94698b3ce97"; // @TODO temporary: remove after login

function mainController($scope, $http, RegisterSWService) {

    //var userId = localStorage.getItem('quxUserId');

    // get user data from API
    $http.get('/api/users/' + userId)
        .success(function(data) { $scope.user = data; })
        .error(function(data) { console.error('Error: ' + data); });

    // init form for additions of questions
    $scope.formData = { "content" : "", "answers" : [], "correctAnswer" : 0, "_userId" : userId };

    // get all user questions
    $scope.getUserQuestions = function() {
      $http.get('/api/users/' + userId + '/questions')
          .success(function(data) { $scope.questions = data; })
          .error(function(data) { console.error('Error: ' + data); });
    };
    $scope.getUserQuestions();

    // create questions
    $scope.createQuestion = function() {
        $http.post('/api/questions', $scope.formData)
            .success(function(data) {
                $scope.formData = { "content" : "", "answers" : [], "correctAnswer" : 0, "_userId" : userId };
                $scope.getUserQuestions();
            })
            .error(function(data) { console.error('Error: ' + data); });
    };

    $scope.deleteQuestion = function(id) {
        $http.delete('/api/questions/' + id)
            .success(function(data) { $scope.getUserQuestions(); })
            .error(function(data) { console.error('Error: ' + data); });
    };
}

app.factory("RegisterSWService", function($http) {
  var endpoint = "";
  // init service worker
  if (!('serviceWorker' in navigator))
    return;

  navigator.serviceWorker.register('sw.js').then(function() {
      return navigator.serviceWorker.ready;
  }).then(function(reg) {
      reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {

        endpoint = sub.endpoint.substr(sub.endpoint.lastIndexOf('/') + 1);
        $http.get('/api/users/' + userId)
            .success(function(data) {
              if (data.endpoints.indexOf(endpoint) !== false)
                return;

              data.endpoints.push(endpoint);
              $http.put('/api/users/' + userId, {endpoints : data.endpoints});
            })
            .error(function(data) {
                console.error('Error: ' + data);
            });
      });
  }).catch(function(error) { console.error('Service Worker error', error); });
});
