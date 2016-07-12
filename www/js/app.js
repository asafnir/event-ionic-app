// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova','ionic.contrib.ui.tinderCards'])

.run(function($ionicPlatform,$cordovaSplashscreen,$timeout,Events,$cordovaGeolocation) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
      Events.getEvents().then(function(data) {
        $cordovaSplashscreen.hide();
      });
      }, function(err) {
      // error
      console.log(err);
      $cordovaSplashscreen.hide();
    });

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('main', {
    url : '/main',
    abstract: true,
    templateUrl : 'templates/main.html',
    controller : 'MainCtrl'
  })
  // .state('main.tabs', {
  //   url: "/tabs",
  //   views: {
  //     templateUrl: "templates/tabs.html",
  //     controller: 'TabsCtrl'
  //   }
  // })
  // Each tab has its own nav history stack:
  .state('main.swipe', {
    url: '/swipe',
    views: {
      'main': {
        templateUrl: 'templates/swipe.html',
        controller: 'SwipeCtrl'
      }
    }
  })
  .state('main.events', {
      url: '/events',
      views: {
        'main': {
          templateUrl: 'templates/events.html',
          controller: 'EventsCtrl'
        }
      }
  })
  .state('main.event-detail', {
    url: '/events/:eventId',
    views: {
      'main': {
        templateUrl: 'templates/event-detail.html',
        controller: 'EventDetailCtrl'
      }
    }
  })
  .state('main.favorites', {
    url: '/favorites',
    views: {
      'main': {
        templateUrl: 'templates/favorites.html',
        controller: 'FavoritesCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main/events');
})
.config(['$httpProvider', function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
    $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.useXDomain = true;
}])
.constant('SERVER', {
  // Local server
  // url: 'http://localhost:3000'

  // Public Heroku server
  url: 'http://localhost:8100/api/'
  // url: 'https://serene-tundra-2660.herokuapp.com'
})
.directive('googleplace', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, model) {
        var options = {
            types: [],
            componentRestrictions: {}
        };
        scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
            scope.$apply(function() {
                model.$setViewValue(element.val());                
            });
        });
    }
  };
})
.directive('ddTextCollapse', ['$compile', function($compile) {
  return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {

          // start collapsed
          scope.collapsed = false;

          // create the function to toggle the collapse
          scope.toggle = function() {
              scope.collapsed = !scope.collapsed;
          };

          // wait for changes on the text
          attrs.$observe('ddTextCollapseText', function(text) {

              // get the length from the attributes
              var maxLength = scope.$eval(attrs.ddTextCollapseMaxLength);

              if (text.length > maxLength) {
                  // split the text in two parts, the first always showing
                  var firstPart = String(text).substring(0, maxLength);
                  var secondPart = String(text).substring(maxLength, text.length);

                  // create some new html elements to hold the separate info
                  var firstSpan = $compile('<span>' + firstPart + '</span>')(scope);
                  var secondSpan = $compile('<span ng-if="collapsed">' + secondPart + '</span>')(scope);
                  var moreIndicatorSpan = $compile('<span ng-if="!collapsed">... </span>')(scope);
                  var lineBreak = $compile('<br ng-if="collapsed">')(scope);
                  var toggleButton = $compile('<span class="collapse-text-toggle" ng-click="toggle()">{{collapsed ? "less" : "more"}}</span>')(scope);

                  // remove the current contents of the element
                  // and add the new ones we created
                  element.empty();
                  element.append(firstSpan);
                  element.append(secondSpan);
                  element.append(moreIndicatorSpan);
                  element.append(lineBreak);
                  element.append(toggleButton);
              }
              else {
                  element.empty();
                  element.append(text);
              }
          });
      }
  };
}]);
//myApp.factory('myService', function() {});
