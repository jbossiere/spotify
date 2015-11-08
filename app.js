$(document).ready(function(){
  $('#filterBar').hide();
  $('#popup').hide();

  $('#popup').click(function() {
    $('#popup').hide();
  });

  // $('[data-toggle="tooltip"]').tooltip(); 

  $('img').tooltip({title: "Hooray!"});

});

var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query=artist:'
var myApp = angular.module('myApp', []);
var scopeArtist;
var trackName;

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.audioObject = {}

  // get songs by artist search
  $scope.getSongs = function() {
    console.log("the scopeArtist is " + scopeArtist);
    console.log("the artist is " + $scope.artist);
    console.log("the track is " + $scope.track);
    console.log("the album is " + $scope.album);

    if ($scope.artist != scopeArtist && $scope.track == undefined && $scope.album == undefined) {
      scopeArtist = $scope.artist;
      console.log("new scopeArtist is " + scopeArtist);
      $('#filterBar').show();
      console.log(baseUrl);
      $http.get(baseUrl + $scope.artist).success(function(response){ 
        console.log(baseUrl + $scope.artist);
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.artist == scopeArtist && $scope.track == undefined && $scope.album == undefined) {
        $http.get('https://api.spotify.com/v1/search?type=track&query=artist:' + $scope.artist).success(function(response){ 
          console.log(baseUrl + $scope.artist);
          data = $scope.tracks = response.tracks.items;  
        });
    }

    // if user searchs a track or an album or both
    if ($scope.track != undefined &&$scope.album == undefined) {
      console.log(baseUrl + $scope.artist + "%20track:" + $scope.track);
      $http.get(baseUrl + $scope.artist + "%20track:" + $scope.track).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.track == undefined && $scope.album != undefined) {
      console.log(baseUrl + $scope.artist + "%20album:" + $scope.album);
      $http.get(baseUrl + $scope.artist + "%20album:" + $scope.album).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.track != undefined && $scope.album != undefined) {
      console.log(baseUrl + $scope.artist + "%20track:" + $scope.track + "%20album:" + $scope.album);
      $http.get(baseUrl + $scope.artist + "%20track:" + $scope.track + "%20album:" + $scope.album).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } 
  }
  

  // play the preview_url
  $scope.play = function(song, track) {
    if($scope.currentSong == song) { //if the current song url is the same as the the one playing
      $scope.audioObject.pause(); //pause the song
      $scope.currentSong = false; //make the current song false
      $('#popup').hide();
      return;
    } else { //if the current song url isn't the same as the one playing
      if($scope.audioObject.pause != undefined) { //if the song isn't paused
        $scope.audioObject.pause() // pause that song
        $('#popup').hide();
      }
      $scope.audioObject = new Audio(song); //then create a new audio object with the new url
      $scope.audioObject.play();   //play that song
      $scope.currentSong = song; //change the song from false to the current url
      $('#popup').show();
      $scope.trackName = track.name;
      $('#popup').html("<img src='" + track.album.images[1].url + "' alt='" + track.name + "' title='" + track.name + "'>");
    }
  }
});



// Add tool tips to anything with a title property
// $('body').tooltip({
//     selector: '[title]'
// });

