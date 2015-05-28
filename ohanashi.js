"use strict";

import 'babel/polyfill';
import Vue from 'vue';
import 'fetch';

let app = window.app = new Vue({
  el: 'main',
  data: {
    idols: [],
    search: {type: ''},
    searchText: '',
    selected: {idol: null, imageIndex: 0, text: ''},
    paragraphs: [],
  },
  methods: {
    select(idol) {
      this.selected.idol = idol;
      if (this.selected.imageIndex >= idol.images.length) {
        this.selected.imageIndex = 0;
      }
      if (!this.selected.text && idol.default_text) {
        this.selected.text = idol.default_text;
      }
    },
    selectImage(index) {
      this.selected.imageIndex = index;
    },
    addParagraph(event) {
      event.preventDefault();
      this.paragraphs.push(JSON.parse(JSON.stringify(this.selected)));
      this.selected.text = '';
    },
    moveup(i) {
      swap(this.paragraphs, i, i-1);
    },
    movedown(i) {
      swap(this.paragraphs, i, i+1);
    },
  },
  ready() {
    fetch('./millionstars.json')
    .then((response) => response.json())
    .then((idols) => {
      this.idols = idols;
      this.selected.idol = idols[37];
    })
    .catch((err) => console.error(err));
  },
  filters: {
    search(idols) {
      return idols.filter((idol) => {
        if (this.search.type && idol.type !== this.search.type) { return false; }
        return idol.name.includes(this.searchText) ||
          idol.yomi.includes(this.searchText);
      });
    },
  },
});

function swap(array, i, j) {
  let t = array[i];
  array[i] = array[j];
  array[j] = t;
}

/*
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
    if ($scope.selected.imageIndex >= idol.images.length)
      $scope.selected.imageIndex = 0;
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
*/
