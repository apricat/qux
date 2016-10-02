var quxQuestions = angular.module('quxQuestions', []);

function mainController($scope, $http) {
    $scope.formData = {
        "text" : "",
        "answers" : {
            "choices" : [],
            "correct" : []
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
                        "correct" : []
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
        for (var answer in $scope.formData.answers) {
            if (!$scope.formData.answers.hasOwnProperty(answer))
                continue; 
            if (!$scope.formData.answers[answer]) 
                continue;

            if (answer.indexOf($scope.question.answers.correct) === 0) {
                $scope.status = ERROR;
                return;
            }
        }

        $scope.formData = {"answers" : []};
        $scope.status = SUCCESS;
        $scope.score++;
        $scope.question = $scope.questions[Math.floor(Math.random() * $scope.questions.length)];
    };

}