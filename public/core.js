var app = angular.module("quxQuestions", []);

var userId = "581949cbad51f94698b3ce97"; // @TODO temporary: remove after login

function mainController($scope, $http, RegisterSWService) {

    //var userId = localStorage.getItem('quxUserId');

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
  }).catch(function(error) {
      console.error('Service Worker error', error);
  });
});
