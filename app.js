$(document).ready(function(){
  $('#filterBar').hide(); // start with filter bars hidden
  $('#popup, .overlay').hide(); //start with popup hidden

  // hide popup if the popup is clicked
  $('#popup, .overlay').click(function() {
    $('#popup, .overlay').hide();
  });

  // $('[data-toggle="tooltip"]').tooltip(); 

  $('.playingSpan').tooltip({title: "Hooray!"});

});

var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query=artist:'
var myApp = angular.module('myApp', []);
var currentArtist;
var trackName;

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.audioObject = {}

  // get songs by artist search
  $scope.getSongs = function() {
    if ($scope.artist != currentArtist && $scope.track == undefined && $scope.album == undefined) {
      currentArtist = $scope.artist;
      $('#filterBar').show();
      $http.get(baseUrl + $scope.artist).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.artist == currentArtist && $scope.track == undefined && $scope.album == undefined) {
        $http.get('https://api.spotify.com/v1/search?type=track&query=artist:' + $scope.artist).success(function(response){ 
          data = $scope.tracks = response.tracks.items;  
        });
    }

    // if user searchs a track or an album or both
    if ($scope.track != undefined &&$scope.album == undefined) {
      $http.get(baseUrl + $scope.artist + "%20track:" + $scope.track).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.track == undefined && $scope.album != undefined) {
      $http.get(baseUrl + $scope.artist + "%20album:" + $scope.album).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.track != undefined && $scope.album != undefined) {
      $http.get(baseUrl + $scope.artist + "%20track:" + $scope.track + "%20album:" + $scope.album).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } 
  }
  

  // play the preview_url
  $scope.play = function(song, track) {
    if($scope.currentSong == song) { 
      $scope.audioObject.pause(); 
      $scope.currentSong = false; 
      return;
    } else { 
      if($scope.audioObject.pause != undefined) { 
        $scope.audioObject.pause() 
      }
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play();   
      $scope.currentSong = song; 
      $('#popup, .overlay').show();
      $scope.trackName = track.name;

      // clear the popup, then append information
      $('#popup').html("");
      $('#popup').append("<img width=" + 450 + " height=" + 450 + " src=" + track.album.images[0].url + " alt=" + track.name + ">");
      $('#popup').append('<h4>"' + track.name + '" by ' + track.artists[0].name + "</h4>")
      $('#popup').append("<h4>" + "from the album <i>" + track.album.name + "</i></h4>")
      $('#popup').append("<hr>")
      $('#popup').append("<p>Displaying Instagram pics tagged with #" + track.artists[0].name.replace(/\s+/g, "") + ":</p>")

      // use the instagram API to get relevant photos, then add the photos to the instagram div in the popup
      $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: "https://api.instagram.com/v1/tags/" + track.artists[0].name.replace(/\s+/g, "") + "/media/recent?access_token=211968027.7222298.1bbdffa25f78459ba915b03b6780eefb",
        success: function(data){
          console.log(data)
          for (var i=0; i<6; i++) {
            console.log(data.data[i].images.low_resolution.url)
            $('#popup').append("<div><img class='instaPic' src='" + data.data[i].images.low_resolution.url + "'></img></div>");
          }
        }
      });
    }
  }

  $scope.pause = function() {
    if(!$scope.audioObject.paused) {
      $scope.audioObject.pause();
      $scope.currentSong = false;
      return;
    }
  }
});

//https://api.instagram.com/v1/tags/coldplay/media/recent?access_token=211968027.7222298.1bbdffa25f78459ba915b03b6780eefb

// https://instagram.com/oauth/authorize/?client_id=81f9925bc91b4fab8d2a053a9237d7f3&redirect_uri=http://localhost:8000/&response_type=token
// accesstoken 11438424.81f9925.4562fc090a894cc695e36976c7c31efa
// Add tool tips to anything with a title property
// $('body').tooltip({
//     selector: '[title]'
// });

