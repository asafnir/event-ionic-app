angular.module('starter.services', [])

.factory('Events', function($http, SERVER) {
  var o = {
    queue: []
  };
  
  o.init = function(){
    if (o.queue.length === 0) {
      // if there's nothing in the queue, fill it.
      // this also means that this is the first call of init.
      return o.getEvents();
    } else {
      // otherwise, 
      return o.getEvents();
    }
  };
  o.getEvents = function(){
    return $http({
      method: 'GET',
      url: SERVER.url + 'events' + '?city=telaviv&country=IL'
    }).success(function(data){
      if (data.mu == null && data.fb == null){return o.queue = o.queue.concat([{fb: ""}])}
      o.queue = o.queue.concat(data.fb.data);

    }).error(function(err){
      console.log(err);
    });
  };
  o.getEvent = function(id) {
    return $http.get(SERVER.url + 'fb/' + id).then(function(res){
      o.queue = res.data;
    });
  };
  o.nextEvent = function(){
    // pop the index 0 off
    o.queue.shift();

    // low on the queue? lets fill it up
    if (o.queue.length <= 3) {
      o.getEvents();
    }
  };

  return o;
})
.factory('User', function(){
  var o = {
    favorites: [],
    newFavorites: 0
  };
  o.addEventToFavorites = function(event){
    // make sure there's a event to add
      if (!event) return false;
      // add to favorites array
      o.favorites.unshift(event);
      o.newFavorites++;
  };
  o.favoriteCount = function() {
    return o.newFavorites;
  }
  o.removeEventFromFavorites = function(event,index){
    // make sure there's a event to remove
    if (!event) return false;
    // remove from favorites array
    o.favorites.splice(index, 1);
  };
  return o;
})
  