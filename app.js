$(document).ready(function(){
  $('#filterBar').hide();
  $('#popup').hide();
});

var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query=artist:'
var myApp = angular.module('myApp', []);
var scopeArtist; // used this for debugging - delete at the end
var trackName;

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  // $('#animateDiv').hide();
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
  $scope.play = function(song, track) {
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

    // gets track name in order to show current playing track
    trackName = track.name;
    $scope.trackName = trackName;
    popup(track);
  };

  var popup = function (track) {
    console.log('kk');
    console.log(trackName)
    var trackImage = track.album.images[1].url;
    console.log(trackImage);
    $('#popup').show();
    $('#popup').html("<img src=https://i.scdn.co/image/9f31af5ca97f84f23a46ad152a89481668e6008f alt='trackName' title='trackName'>"); //Why isn't this thing working? if I put any other image url, it shows!
  }; 
//  Problem displaying image could be caused by response format (https://developer.spotify.com/technologies/metadata-api/) Figure out how to use?

});

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});

