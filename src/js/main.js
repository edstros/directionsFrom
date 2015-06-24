var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

console.log(whereTo + 'top of the js file');

function initialize() {
  var mapCanvas = document.getElementById('map-canvas'); //div in the html
  var mapOptions = {
    center: new google.maps.LatLng(36.1667, 86.7833), //NashVegas, TN
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(mapCanvas, mapOptions);
  console.log(map); //this works, produces map object
  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); //pos should be available to use as the start
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        pixelOffset: new google.maps.Size(0, -20),
        content: 'Found you! You are here.'
      });
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'Your current location'
      });
      //copied the next six lines from google
      google.maps.event.addListener(marker, 'click', toggleBounce);

      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
      google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker); //this should be redone in the infobox class
      });
      map.setCenter(pos);
      //refactored code from weather app
      var btnWhereTo = document.querySelector('#btnWhereTo'); //creates the button element using the id from the button input
      btnWhereTo.onclick = function () {
        calcRoute();
      };
      //adds the calcroute within geolocation because geolocation is the starting point
    }, function () {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Aw snap! Something went wrong with the Geolocation service. Sorry?';
  } else {
    var content = 'Aw, snap! Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(36.1667, 86.7833),
    content: content
  };
  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}
    console.log(whereTo + 'before calcRoute');

function calcRoute() {
  var input = document.querySelector('#whereTo'); //takes the user's input
var whereTo = input.value; //takes the value of the user input for the destination
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  navigator.geolocation.getCurrentPosition(function (position) {
    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var request = {
      origin: pos, //from geolocation
      destination: whereTo, //from input.value of #whereTo
      travelMode: google.maps.TravelMode.DRIVING
    };
    console.log(pos);
    console.log(whereTo);
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  });
};
google.maps.event.addDomListener(window, 'load', initialize, calcRoute);
