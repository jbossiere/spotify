$(document).ready(function(){
  $('#filterBar').hide();
});
var data;
var songUrl = 'https://api.spotify.com/v1/search?type=track&query=artist:'
var artistUrl = 'https://api.spotify.com/v1/search?type=artist&query='
var myApp = angular.module('myApp', [])

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.audioObject = {}

  // get songs
  $scope.getSongs = function() {
    console.log($scope.artist)
    console.log('check1')
    $('#filterBar').show();
    $http.get(songUrl + $scope.artist).success(function(response){ 
      data = $scope.tracks = response.tracks.items;  
    });

    // if user searchs a track or an album or both
    if ($scope.track != undefined &&$scope.album == undefined) {
      console.log(songUrl + $scope.artist + "%20track:" + $scope.track);
      $http.get(songUrl + $scope.artist + "%20track:" + $scope.track).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.track == undefined && $scope.album != undefined) {
      console.log(songUrl + $scope.artist + "%20album:" + $scope.album);
      $http.get(songUrl + $scope.artist + "%20album:" + $scope.album).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.track != undefined && $scope.album != undefined) {
      console.log(songUrl + $scope.artist + "%20track:" + $scope.track + "%20album:" + $scope.album);
      $http.get(songUrl + $scope.artist + "%20track:" + $scope.track + "%20album:" + $scope.album).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    }
  };
  
  // get artists
  $scope.getArtist = function() {
    $http.get(artistUrl + $scope.artist).success(function(response){ 
      data = $scope.artists = response.artists.items;
      console.log('hello1');
      console.log('hello2');
      console.log(data);
      //$scope.artist = '';  erases user input after submit
    });
  };

  // play the preview_url
  $scope.play = function(song) {
    if($scope.currentSong == song) {
      $scope.audioObject.pause();
      $scope.currentSong = false;
      return;
    } else {
      if($scope.audioObject.pause != undefined) $scope.audioObject.pause()
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play();  
      $scope.currentSong = song;
    }
  };

  // $('#resultList').click(function(){
  //     $('#streamDiv').hide();
  //   $('#streamDiv').animate({
  //     height: "toggle"
  //   } function() {
  //     height: "100px"
  //   });
  // });

});

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});

