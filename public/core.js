var quxQuestions = angular.module('quxQuestions', []);

function mainController($scope, $http) {

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

              if ($scope.user == null || $scope.user.endpoint == null || $scope.user.endpoint[0] == null || $scope.user.endpoint[0] == endpoint)
                return;

              // add endpoint to current user
              $http.put('/api/user/' + $scope.user._id, {username : $scope.user.username, score : $scope.user.score, endpoints : [endpoint]}).error(function(data) { console.log('Error updating user with new endpoint: ' + data); });
            });
        }).catch(function(error) {
            console.log('Service Worker error', error);
        });
    }

    // init user
    var userId = localStorage.getItem('quxUserId');
    console.log(userId);

    if (userId == null) {
      // TODO: log out... for now lets just create a new user
      var tempUser = {
          "username" : "temp",
          "endpoints" : [endpoint],
          "score" : 0
      };
      $http.post('/api/user', tempUser)
          .success(function(data) {
              $scope.user = data;
              localStorage.setItem('quxUserId', data._id)
              console.log(data);
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    } else {

      // get user data from API and not from localStorage
      $http.get('/api/user/' + userId, {id : userId})
          .success(function(data) {
              $scope.user = data;
              console.log(data);
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    }

    // init form for additions of questions
    $scope.formData = {
        "text" : "",
        "answers" : {
            "choices" : [],
            "correct" : 0
        }
    };

    // get all questions
    $http.get('/api/questions')
        .success(function(data) {
            $scope.questions = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // create questions
    $scope.createQuestion = function() {
        console.log($scope.formData);
        $http.post('/api/questions', $scope.formData)
            .success(function(data) {
                $scope.formData = {
                    "text" : "",
                    "answers" : {
                        "choices" : [],
                        "correct" : 0
                    }
                };
                $scope.questions = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteQuestion = function(id) {
        $http.delete('/api/questions/' + id)
            .success(function(data) {
                $scope.questions = data;
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

        if ($scope.formData.answers != $scope.question.answers.correct) {
            $scope.status = ERROR;
            return;
        }

        $scope.formData = {"answers" : []};
        $scope.status = SUCCESS;
        $scope.score++;
        $scope.question = $scope.questions[Math.floor(Math.random() * $scope.questions.length)];
    };

}
