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
    center: new google.maps.LatLng(36.1667, -86.7833), //NashVegas, TN
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false,
  };
  map = new google.maps.Map(mapCanvas, mapOptions);
  console.log('map', map); //this works, produces map object
  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        //pixelOffset: new google.maps.Size(0, -20),
        content: 'You are here'
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
      console.log('map inside the geolocation function', map);
      //refactored code from weather app
      var btnWhereTo = document.querySelector('#btnWhereTo'); //creates the button element using the id from the button input
      btnWhereTo.onclick = function () {
        // closestHooters();
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
  //////////////////////////////
  //now returns objects!
  //////////////////////////////
function closestHooters() {
    var whereTo = document.querySelector('#whereTo').value.split(' ').join('+');
    var MAPS_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    $.get(MAPS_URL + whereTo, function (data) {
      console.log('data', data); //now it sees this
      var hootersDistances = [];
      var destLat = data.results[0].geometry.location.lat;
      var destLatCoord = parseFloat(destLat); //otherwise returns a string
      console.log("destination latitude with parstFloat", destLat);
      var destLng = data.results[0].geometry.location.lng;
      var destLngCoord = parseFloat(destLng);
      var destLatLng = new google.maps.LatLng(destLatCoord, destLngCoord);
      console.log("both together; are these numbers?", destLatLng);
      var hooters2ndAve = new google.maps.LatLng(36.1743706, -86.78299390000001);
      var hootersLebanonPike = new google.maps.LatLng(36.18633370000001, -86.63314799999999);
      var hootersLargoDrive = new google.maps.LatLng(36.081514, -86.7095413);
      console.log("both together and the 2nd Ave Hooters", destLatLng, "2nd Ave", hooters2ndAve, "are these objects?");
      var distSecondAve = google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hooters2ndAve);
      var distLebanonPike = google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hootersLebanonPike);
      var distLargoDrive = google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hootersLargoDrive);
      hootersDistances.push(distLargoDrive, distLebanonPike, distSecondAve);
      var nearestHooters = Math.min.apply(Math, hootersDistances);
      /* var hootersWaypoint = function () {
      if (nearestHooters === distSecondAve) {
        return hooters2ndAve;
      } else if (nearestHooters === distLargoDrive) {
        return hootersLargoDrive;
      } else if (nearestHooters === distLebanonPike) {
        return hootersLebanonPike;
      }
    };hootersWaypoint();
//moving this marker down to become waypts
var hootersMarker = new google.maps.Marker({
      position: hooters2ndAve,
      map: map,
      icon: 'http://edwinacevedo.com/directionsFrom/img/hooters-marker.png'
  });*/
    });
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
function calcRoute(pos, destLatLng) {
  //placing the owl, these lines from here
  var markers = []; //this would have been used in an array for the nearby hooters
  var btnWhereTo = document.querySelector('#btnWhereTo');
  google.maps.event.addListener(btnWhereTo, 'click', function (event) {
    addMarker();
  });
  console.log(btnWhereTo)

  function addMarker() {
    var marker = new google.maps.Marker({ //moving this down closer to waypoints
      position: hooters2ndAve,
      map: map,
      image: 'http://edwinacevedo.com/directionsFrom/img/hooters-sauce.png'
    });
    markers.push(marker); //this would have pushed the markers into ana rray
  }
  //to here
  var whereTo = document.querySelector('#whereTo').value;
  var hooters2ndAve = new google.maps.LatLng(36.1743706, -86.78299390000001);
  console.log('hooters2ndAve', hooters2ndAve);
  var waypts = [{
    location: hooters2ndAve, //this is undefined
    stopover: true
  }];
  directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
  });
  directionsDisplay.setMap(map);
  navigator.geolocation.getCurrentPosition(function (position) {
    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var marker = new google.maps.Marker({
      position: hooters2ndAve /*waypts*/ ,
      map: map,
      icon: 'http://edwinacevedo.com/directionsFrom/img/hooters-marker.png'
    });
    var request = {
      origin: pos, //from geolocation
      destination: whereTo, //from input.value of #whereTo
      waypoints: waypts,
      //placeId: 'ChIJOwE7_GTtwokRFq0uOwLSE9g'
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING
    };
    console.log('waypts', waypts);
    console.log('marker', marker);
    console.log('map', map);
    console.log('pos', pos);
    console.log('whereTo, this time including the input.value', whereTo);
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  });
}
google.maps.event.addDomListener(window, 'load', initialize, calcRoute, closestHooters);
