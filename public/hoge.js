var app = angular.module("unko", []);
app.controller('Ctrl', function($scope, $http) {
  $scope.search = {type: ""};
  $scope.selected = {};
  $scope.scenario = {paragraphs: []};

  $http.get('millionstars.json').success(function(idols) {
    $scope.idols = idols;

    $scope.selected.idol = idols[37];
    $scope.selected.index = 0;
  });

  $scope.addParagraph = function() {
    $scope.scenario.paragraphs.push({
      idol: $scope.selected.idol,
      image: $scope.selected.idol.images[$scope.selected.index],
      serifu: $scope.serifu,
      imageIndex: $scope.selected.index,
    });
  }
});
