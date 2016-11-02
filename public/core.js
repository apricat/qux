var quxQuestions = angular.module('quxQuestions', []);

function mainController($scope, $http) {

  //var userId = localStorage.getItem('quxUserId');
  var userId = "581949cbad51f94698b3ce97"; // @TODO temporary: remove after login

  var endpoint = "";
  // init service worker
  if ('serviceWorker' in navigator) {
      console.log('Service Worker is supported');

      navigator.serviceWorker.register('sw.js').then(function() {
          return navigator.serviceWorker.ready;
      }).then(function(reg) {
          reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
            endpoint = sub.endpoint.substr(sub.endpoint.lastIndexOf('/') + 1);
            console.log('endpoint:', endpoint);

            if (typeof $scope.user == 'undefined') {
              $http.get('/api/users/' + userId)
                  .success(function(data) {
                      if (typeof data.endpoints == 'undefined') {
                        $http.put('/api/users/' + userId, {endpoints : [endpoint]});
                      } else if (!data.endpoints.indexOf(endpoint)) {
                        data.endpoints.push(endpoint);
                        $http.put('/api/users/' + userId, {endpoints : data.endpoints});
                      }
                  })
                  .error(function(data) {
                      console.log('Error: ' + data);
                  });
            } else {
              if ($scope.user.endpoints.length == 0) {
                $http.put('/api/users/' + userId, {endpoints : [endpoint]});
              } else if (!$scope.user.endpoints.indexOf(endpoint)) {
                $scope.user.endpoints.push(endpoint);
                $http.put('/api/users/' + userId, {endpoints : $scope.user.endpoints});
              }
            }
          });
      }).catch(function(error) {
          console.log('Service Worker error', error);
      });
  }

      // get user data from API
    $http.get('/api/users/' + userId)
        .success(function(data) {
            $scope.user = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // init form for additions of questions
    $scope.formData = {
        "content" : "",
        "answers" : [],
        "correctAnswer" : 0
    };

    // get all user questions
    $scope.getUserQuestions = function() {
      $http.get('/api/users/' + userId + '/questions')
          .success(function(data) {
              $scope.questions = data;
              console.log(data);
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };
    $scope.getUserQuestions();

    // create questions
    $scope.createQuestion = function() {
        console.log($scope.formData);

        // todo upload thumbnail and return path

        $http.post('/api/questions', $scope.formData)
            .success(function(data) {
                $scope.formData = {
                    "content" : "",
                    "answers" : [],
                    "correctAnswer" : 0
                };
                $scope.getUserQuestions();
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteQuestion = function(id) {
        $http.delete('/api/questions/' + id)
            .success(function(data) {
                $scope.getUserQuestions();
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}

function quizzController($scope, $http) {
    const ERROR = 0;
    const SUCCESS = 1;

    $scope.formData = {"answers" : []};
    $scope.score = 0;

    $http.get('/api/questions')
        .success(function(data) {
            $scope.questions = data;
            $scope.question = $scope.questions[Math.floor(Math.random() * $scope.questions.length)];
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.validateAnswer = function() {
        if (!$scope.formData.answers.length) {
            $scope.status = ERROR;
            return;
        }

        if ($scope.formData.answers != $scope.question.correctAnswer) {
            $scope.status = ERROR;
            return;
        }

        $scope.formData = {"answers" : []};
        $scope.status = SUCCESS;
        $scope.score++;
        $scope.question = $scope.questions[Math.floor(Math.random() * $scope.questions.length)];
    };

}
