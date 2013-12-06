var app = angular.module("ohanashi", []);
app.controller('Ctrl', function($scope, $http) {
  $scope.search = {type: ""};
  $scope.selected = {};
  $scope.paragraphs = [];

  $http.get('millionstars.json').success(function(idols) {
    $scope.idols = idols;

    $scope.selected.idol = idols[37];
    $scope.selected.imageIndex = 0;
  });

  $scope.select = function(idol) {
    $scope.selected.idol = idol;
    if (!$scope.selected.text && idol.default_text)
      $scope.selected.text = idol.default_text;
  }

  $scope.addParagraph = function() {
    $scope.paragraphs.push(angular.copy($scope.selected));
    $scope.selected.text = '';
  }

  var swap = function(array, i, j) {
    var t = array[i];
    array[i] = array[j];
    array[j] = t;
  }

  $scope.moveup = function(array, i) {
    swap(array, i, i-1);
  }

  $scope.movedown = function(array, i) {
    swap(array, i, i+1);
  }

});
