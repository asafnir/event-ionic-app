angular.module('starter.controllers', [])

.controller('EventsCtrl', function($scope,Events) {
  $scope.gPlace;
  Events.getEvents().then(function(){
    $scope.events = Events.queue;
  });
})

.controller('EventDetailCtrl', function($scope, $stateParams, Events,User,$cordovaCalendar) {
  $scope.liked = false;
  Events.getEvent($stateParams.eventId).then(function(){
    $scope.event = Events.queue;
  });
  $scope.sendFeedback = function(bool){
    // first, add to favorites if they favorited
    if (bool){
      $scope.liked = false;
      User.removeEventFromFavorites($scope.event,User.favorites.length-1);
      User.newFavorites-- ;
    } else {
      $scope.liked = true;
      User.addEventToFavorites($scope.event);
    }
  };
  $scope.addEventToCalendar = function(){
    if (!$scope.event) return false;

    $cordovaCalendar.createEvent({
      title: $scope.event.name,
      location: "{{$scope.event.place.location.city}} {{$scope.event.place.location.country}}",
      startDate: $scope.event.start_time,
    }).then(function (result) {
      $scope.eventAdd = true;
    }, function (err) {
      // error
    });
  };
})

.controller('SwipeCtrl', function($scope,$ionicLoading,$timeout,Events,User) {
	// helper functions for loading
  var showLoading = function() {
  	$ionicLoading.show({
      template: '<i class="ion-loading-c"></i>',
      noBackdrop: true
    });
  };
  var hideLoading = function() {
    $ionicLoading.hide();
  };
  // set loading to true first time while we retrieve event from server.
  showLoading();
  Events.init()
    .then(function(){
      $scope.currentEvent = Events.queue[0];
      return;
  }).then(function(){
    // turn loading off
    hideLoading();
    $scope.currentEvent.loaded = true;
  });
  $scope.sendFeedback = function(bool){
    // first, add to favorites if they favorited
    if (bool) User.addEventToFavorites($scope.currentEvent);
    // set variable for the correct animation sequence
    $scope.currentEvent.rated = bool;
    $scope.currentEvent.hide = true;

    // prepare the next song
    Events.nextEvent();
    
    $timeout(function() {
      // update current song in scope
      $scope.currentEvent = Events.queue[0];
      $scope.currentEvent.loaded = false;
    }, 250);
  };
})

.controller('FavoritesCtrl', function($scope,User) {
	$scope.favorites = User.favorites;
  $scope.removeEvent = function(event,index){
    User.removeEventFromFavorites(event,index);
  }  
})

.controller('TabsCtrl', function($scope,Events,User) {
  // expose the number of new favorites to the scope
  $scope.favCount = User.favoriteCount;
  $scope.enteringFavorites = function() {
    User.newFavorites = 0;
  };
  $scope.leavingFavorites = function() {
    return;
  };
})

.controller('MainCtrl',function($scope, $ionicSideMenuDelegate){
  
})

.controller('NavCtrl',function($scope, $ionicSideMenuDelegate){
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };  
});
