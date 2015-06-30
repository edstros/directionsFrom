var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var pos;
var destLatLng;
////////////////////////
//start the party
////////////////////////
function initialize() {
  var mapCanvas = document.getElementById('map-canvas'); //div in the html
  var mapOptions = {
    center: new google.maps.LatLng(36.1667, 86.7833), //NashVegas, TN
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false,
  };
  map = new google.maps.Map(mapCanvas, mapOptions);
  console.log(map); //this works, produces map object
  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        pixelOffset: new google.maps.Size(0, -20),
        content: 'Start here'
      });
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'This is your geolocation'
      });
      //copied the next six lines from google, not gonna lie
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
      console.log(map);
      //refactored code from weather app
      var btnWhereTo = document.querySelector('#btnWhereTo'); //creates the button element using the id from the button input
      btnWhereTo.onclick = function () {
        closestHooters();
        calcRoute(pos);
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

function closestHooters() {
  var input = document.querySelector('#whereTo');
  var whereTo = input.value;
  var destinationAddress = whereTo.split(' ').join('+');
  var MAPS_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
  $.get(MAPS_URL + destinationAddress, function (data) {
    var distances = [];
    var destLat = data.results[0].geometry.location.lat;
    var destLng = data.results[0].geometry.location.lng;
    var destLatLng = destLat + ',' + destLng;
    console.log(destLatLng);

    var hooters2ndAve = new google.maps.LatLng(36.1618914,-86.789464);
    var hootersLebanonPike = new google.maps.LatLng(36.18633370000001,-86.63314799999999);
    var hootersLargoDrive = new google.maps.LatLng(36.081514,-86.7095413);
    var distSecondAve = google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hooters2ndAve);
    var distLebanonPike =  google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hootersLebanonPike);
    var distLargoDrive =  google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hootersLargoDrive);
    console.dir(Number(distSecondAve));
    var hootersWaypoint = distances.push(distLargoDrive, distLebanonPike, distSecondAve).Math.min.apply(null, distances);
     console.log(hootersWaypoint);  return hootersWaypoint;

  });
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
  //////////////////////////////////
  //autocomplete for the search box
  /////////////////////////////////
var pac_input = document.getElementById('whereTo');
(function pacSelectFirst(input) {
  // store the original event binding function
  var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

  function addEventListenerWrapper(type, listener) {
    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
    // and then trigger the original listener.
    if (type == "keydown") {
      var orig_listener = listener;
      listener = function (event) {
        var suggestion_selected = $(".pac-item-selected").length > 0;
        if (event.which == 13 && !suggestion_selected) {
          var simulated_downarrow = $.Event("keydown", {
            keyCode: 40,
            which: 40
          });
          orig_listener.apply(input, [simulated_downarrow]);
        }
        orig_listener.apply(input, [event]);
      };
    }
    // add the modified listener
    _addEventListener.apply(input, [type, listener]);
  }
  if (input.addEventListener)
    input.addEventListener = addEventListenerWrapper;
  else if (input.attachEvent)
    input.attachEvent = addEventListenerWrapper;
})(pac_input);
$(function () {
  var autocomplete = new google.maps.places.Autocomplete(pac_input);
});
//////////////////////////////
//draw the route on the map
/////////////////////////////
function calcRoute(pos, destLatLng, hootersWaypoint) {
  var waypts = [{
      location: hootersWaypoint, //this is undefined
      stopover: true
  }]; //var MAPS_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
  /*var input = document.querySelector('#whereTo');
  var whereTo = input.value;
  var destinationAddress = whereTo.split(' ').join('+');*/
  /*  var hooters2ndAve = new google.maps.LatLng(36.1618914, -86.789464);
    var hootersLebanonPike = new google.maps.LatLng(36.18633370000001, -86.63314799999999);
    var hootersLargoDrive = new google.maps.LatLng(36.081514, -86.7095413);*/
  // var midTnHooters = [hootersLebanonPike, hooters2ndAve, hootersLargoDrive];
  //var hooters2ndAve =  new.google.maps.place.place_id('ChIJH_4dHFpmZIgR5zLArMUmS0c');//this is place_Id
  /*  function addHooters () {
      var hooters2ndAve = new google.maps.LatLng(36.1646,-86.7766);
    waypoints.push()/*blah, blah, blah;*/
  // var pos = new google.maps.LatLng(pos);
  var request = {
    origin: pos, //from geolocation
    destination: whereTo, //from input.value of #whereTo
    waypoints: waypts,
    //placeId: 'ChIJOwE7_GTtwokRFq0uOwLSE9g'
    optimizeWaypoints: false,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function (response, status) {
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    //  navigator.geolocation.getCurrentPosition(function (position) {

    console.log(waypts);
    // var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
/*    var request = {
      origin: pos, //from geolocation
      destination: whereTo, //from input.value of #whereTo
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING
    };*/
    //////////////////////////////////
    //this next function broke my app
    //////////////////////////////////
    // input.addEventListener('click', closestHooters);
    /*    var closestHooters = function () {
          $.get(MAPS_URL + destinationAddress, function (data) {
            var distances = [];
            var destLat = data.results[0].geometry.location.lat;
            var destLng = data.results[0].geometry.location.lng;
            var destLatLng = destLat + ',' + destLng;
            var distSecondAve = new google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hooters2ndAve);
            var distLebanonPike = new google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hootersLebanonPike);
            var distLargoDrive = new google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hootersLargoDrive);
            distances.push(distLargoDrive, distLebanonPike, distSecondAve).Math.min.apply(null, distances);
            console.log(distances);
            console.log(distLargoDrive);
          });
        }*/

    console.log(map);
    console.log(pos);
    console.log(whereTo);
    console.log(destinationAddress);
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
    // });
  });
}
google.maps.event.addDomListener(window, 'load', initialize, calcRoute);
