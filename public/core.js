var quxQuestions = angular.module('quxQuestions', []);

function mainController($scope, $http) {
    if ('serviceWorker' in navigator) {
        console.log('Service Worker is supported');
        navigator.serviceWorker.register('sw.js').then(function() {
            return navigator.serviceWorker.ready;
        }).then(function(reg) {
            reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) { console.log('endpoint:', sub.endpoint); });
        }).catch(function(error) {
            console.log('Service Worker error', error);
        });
    }

    $scope.formData = {
        "text" : "",
        "answers" : {
            "choices" : [],
            "correct" : 0
        }
    };

    $http.get('/api/questions')
        .success(function(data) {
            $scope.questions = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

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