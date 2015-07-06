'use strict';

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
    scrollwheel: false };
  map = new google.maps.Map(mapCanvas, mapOptions);
  console.log('map', map); //this works, produces map object
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
      console.log(pos);
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
//////////////////////////////
//returns objects! hallelujah!
//////////////////////////////
function closestHooters() {
  var whereTo = document.querySelector('#whereTo').value.split(' ').join('+');
  var MAPS_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
  $.get(MAPS_URL + whereTo, function (data) {
    console.log('data', data); //now it sees this
    var hootersDistances = [];
    var destLat = data.results[0].geometry.location.lat;
    var destLatCoord = parseFloat(destLat); //otherwise returns a string
    console.log('destination latitude with parstFloat', destLat);
    var destLng = data.results[0].geometry.location.lng;
    var destLngCoord = parseFloat(destLng);
    var destLatLng = new google.maps.LatLng(destLatCoord, destLngCoord);
    console.log('both together; are these numbers?', destLatLng);
    var hooters2ndAve = new google.maps.LatLng(36.1618914, -86.789464);
    var hootersLebanonPike = new google.maps.LatLng(36.18633370000001, -86.63314799999999);
    var hootersLargoDrive = new google.maps.LatLng(36.081514, -86.7095413);
    console.log('both together and the 2nd Ave Hooters', destLatLng, '2nd Ave', hooters2ndAve, 'are these objects?');
    var distSecondAve = google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hooters2ndAve);
    var distLebanonPike = google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hootersLebanonPike);
    var distLargoDrive = google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hootersLargoDrive);
    hootersDistances.push(distLargoDrive, distLebanonPike, distSecondAve);
    var nearestHooters = Math.min.apply(Math, hootersDistances);
    var hootersWaypoint = function hootersWaypoint() {
      if (nearestHooters === distSecondAve) {
        return hooters2ndAve;
      } else if (nearestHooters === distLargoDrive) {
        return hootersLargoDrive;
      } else if (nearestHooters === distLebanonPike) {
        return hootersLebanonPike;
      }
    };
    hootersWaypoint();
    var hootersMarker = new google.maps.Marker({
      position: hooters2ndAve,
      map: map,
      icon: 'http://edwinacevedo.com/directionsFrom/img/hooters-marker.png'
    });
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
  var _addEventListener = input.addEventListener ? input.addEventListener : input.attachEvent;

  function addEventListenerWrapper(type, listener) {
    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
    // and then trigger the original listener.
    if (type == 'keydown') {
      var orig_listener = listener;
      listener = function (event) {
        var suggestion_selected = $('.pac-item-selected').length > 0;
        if (event.which == 13 && !suggestion_selected) {
          var simulated_downarrow = $.Event('keydown', {
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
  if (input.addEventListener) input.addEventListener = addEventListenerWrapper;else if (input.attachEvent) input.attachEvent = addEventListenerWrapper;
})(pac_input);
$(function () {
  var autocomplete = new google.maps.places.Autocomplete(pac_input);
});
//////////////////////////////
//draw the route on the map
/////////////////////////////
function calcRoute(pos, destLatLng, hootersWaypoint) {
  //console.log('closestHooters', closestHooters);
  //placing the owl, these lines from here
  var markers = [];
  google.maps.event.addListener(map, 'click', function (event) {
    addMarker(event.latLng);
  });
  //////////////////////////////////////
  //changing the name from marker to hootersMarker
  //////////////////////////////////////
  console.log(hootersWaypoint, 'hootersWaypoint');
  var hootersMarker = new google.maps.Marker({
    position: waypts,
    map: map,
    title: 'Stop for wings and beer!',
    icon: 'http://edwinacevedo.com/directionsFrom/img/hooters-marker.png'
  });
  markers.push(hootersMarker);
  // ### end owl marker
  //added infowindow from here
  /*var contentString = '<div id="content">' +
    '<h1 id="firstHeading" class="firstHeading">Stop here for beer & wings</h1>' +
    '</div>';*/
  /*var infowindow = new google.maps.InfoWindow({
    content: 'this is a test ', //contentString,
    maxWidth: 300
  });*/
  /*  var hooters2ndAveMarker = new google.maps.Marker({
        position: hooters2ndAve,
        map: map,
        title: 'Stop for Beer and Wings'
    });*/
  google.maps.event.addListener(hootersMarker, 'click', function () {
    infowindow.open(map, hootersMarker);
    console.log('map object:', map, 'hooters marker:', hootersMarker);
    alert(map);
    alert(hootersMarker);
  });
  // #### end infowindow
  var whereTo = document.querySelector('#whereTo').value;
  var hooters2ndAve = new google.maps.LatLng(36.1618914, -86.789464);
  var waypts = [{
    location: hooters2ndAve, //this is undefined
    stopover: true
  }];
  directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: true
  });
  directionsDisplay.setMap(map);
  navigator.geolocation.getCurrentPosition(function (position) {
    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var request = {
      origin: pos,
      destination: whereTo, //from input.value of #whereTo
      waypoints: waypts,
      //placeId: 'ChIJOwE7_GTtwokRFq0uOwLSE9g'
      optimizeWaypoints: false,
      display: false,
      travelMode: google.maps.TravelMode.DRIVING
    };
    console.log('waypts', waypts);
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
google.maps.event.addDomListener(window, 'load', initialize, calcRoute /*, closestHooters*/); //, calcRoute, closestHooters
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxPQUFPLEVBQUUsVUFBVSxRQUFRLEVBQUUsTUFBTSxFQUFFO0FBQzNELFVBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFO0FBQzdDLHlCQUFpQixDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUMzQztLQUNGLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKO0FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsc0JBQXFCLENBQUMiLCJmaWxlIjoic3JjL2pzL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZGlyZWN0aW9uc0Rpc3BsYXk7XG52YXIgZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UoKTtcbnZhciBtYXA7XG52YXIgcG9zO1xudmFyIGRlc3RMYXRMbmc7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vc3RhcnQgdGhlIHBhcnR5XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgdmFyIG1hcENhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtY2FudmFzJyk7IC8vZGl2IGluIHRoZSBodG1sXG4gICAgdmFyIG1hcE9wdGlvbnMgPSB7XG4gICAgICBjZW50ZXI6IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoMzYuMTY2NywgLTg2Ljc4MzMpLCAvL05hc2hWZWdhcywgVE5cbiAgICAgIHpvb206IDE1LFxuICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcbiAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICB9O1xuICAgIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAobWFwQ2FudmFzLCBtYXBPcHRpb25zKTtcbiAgICBjb25zb2xlLmxvZygnbWFwJywgbWFwKTsgLy90aGlzIHdvcmtzLCBwcm9kdWNlcyBtYXAgb2JqZWN0XG4gICAgLy8gVHJ5IEhUTUw1IGdlb2xvY2F0aW9uXG4gICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgcG9zID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xuICAgICAgICB2YXIgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcbiAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICBwb3NpdGlvbjogcG9zLFxuICAgICAgICAgIHBpeGVsT2Zmc2V0OiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgwLCAtMjApLFxuICAgICAgICAgIGNvbnRlbnQ6ICdTdGFydCBoZXJlJ1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2cocG9zKTtcbiAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCxcbiAgICAgICAgICB0aXRsZTogJ1RoaXMgaXMgeW91ciBnZW9sb2NhdGlvbidcbiAgICAgICAgfSk7XG4gICAgICAgIC8vY29waWVkIHRoZSBuZXh0IHNpeCBsaW5lcyBmcm9tIGdvb2dsZSwgbm90IGdvbm5hIGxpZVxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIHRvZ2dsZUJvdW5jZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlQm91bmNlKCkge1xuICAgICAgICAgIGlmIChtYXJrZXIuZ2V0QW5pbWF0aW9uKCkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIG1hcmtlci5zZXRBbmltYXRpb24obnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hcmtlci5zZXRBbmltYXRpb24oZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkJPVU5DRSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGluZm93aW5kb3cub3BlbihtYXAsIG1hcmtlcik7IC8vdGhpcyBzaG91bGQgYmUgcmVkb25lIGluIHRoZSBpbmZvYm94IGNsYXNzXG4gICAgICAgIH0pO1xuICAgICAgICBtYXAuc2V0Q2VudGVyKHBvcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgaW5zaWRlIHRoZSBnZW9sb2NhdGlvbiBmdW5jdGlvbicsIG1hcCk7XG4gICAgICAgIC8vcmVmYWN0b3JlZCBjb2RlIGZyb20gd2VhdGhlciBhcHBcbiAgICAgICAgdmFyIGJ0bldoZXJlVG8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnRuV2hlcmVUbycpOyAvL2NyZWF0ZXMgdGhlIGJ1dHRvbiBlbGVtZW50IHVzaW5nIHRoZSBpZCBmcm9tIHRoZSBidXR0b24gaW5wdXRcbiAgICAgICAgYnRuV2hlcmVUby5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNsb3Nlc3RIb290ZXJzKCk7XG4gICAgICAgICAgY2FsY1JvdXRlKHBvcyk7XG4gICAgICAgIH07XG4gICAgICAgIC8vYWRkcyB0aGUgY2FsY3JvdXRlIHdpdGhpbiBnZW9sb2NhdGlvbiBiZWNhdXNlIGdlb2xvY2F0aW9uIGlzIHRoZSBzdGFydGluZyBwb2ludFxuICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBoYW5kbGVOb0dlb2xvY2F0aW9uKHRydWUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IEdlb2xvY2F0aW9uXG4gICAgICBoYW5kbGVOb0dlb2xvY2F0aW9uKGZhbHNlKTtcbiAgICB9XG4gIH1cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vcmV0dXJucyBvYmplY3RzISBoYWxsZWx1amFoIVxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmZ1bmN0aW9uIGNsb3Nlc3RIb290ZXJzKCkge1xuICB2YXIgd2hlcmVUbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3aGVyZVRvJykudmFsdWUuc3BsaXQoJyAnKS5qb2luKCcrJyk7XG4gIHZhciBNQVBTX1VSTCA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2FkZHJlc3M9JztcbiAgJC5nZXQoTUFQU19VUkwgKyB3aGVyZVRvLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKCdkYXRhJywgZGF0YSk7IC8vbm93IGl0IHNlZXMgdGhpc1xuICAgIHZhciBob290ZXJzRGlzdGFuY2VzID0gW107XG4gICAgdmFyIGRlc3RMYXQgPSBkYXRhLnJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubGF0O1xuICAgIHZhciBkZXN0TGF0Q29vcmQgPSBwYXJzZUZsb2F0KGRlc3RMYXQpOyAvL290aGVyd2lzZSByZXR1cm5zIGEgc3RyaW5nXG4gICAgY29uc29sZS5sb2coXCJkZXN0aW5hdGlvbiBsYXRpdHVkZSB3aXRoIHBhcnN0RmxvYXRcIiwgZGVzdExhdCk7XG4gICAgdmFyIGRlc3RMbmcgPSBkYXRhLnJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nO1xuICAgIHZhciBkZXN0TG5nQ29vcmQgPSBwYXJzZUZsb2F0KGRlc3RMbmcpO1xuICAgIHZhciBkZXN0TGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhkZXN0TGF0Q29vcmQsIGRlc3RMbmdDb29yZCk7XG4gICAgY29uc29sZS5sb2coXCJib3RoIHRvZ2V0aGVyOyBhcmUgdGhlc2UgbnVtYmVycz9cIiwgZGVzdExhdExuZyk7XG4gICAgdmFyIGhvb3RlcnMybmRBdmUgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDM2LjE2MTg5MTQsIC04Ni43ODk0NjQpO1xuICAgIHZhciBob290ZXJzTGViYW5vblBpa2UgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDM2LjE4NjMzMzcwMDAwMDAxLCAtODYuNjMzMTQ3OTk5OTk5OTkpO1xuICAgIHZhciBob290ZXJzTGFyZ29Ecml2ZSA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoMzYuMDgxNTE0LCAtODYuNzA5NTQxMyk7XG4gICAgY29uc29sZS5sb2coXCJib3RoIHRvZ2V0aGVyIGFuZCB0aGUgMm5kIEF2ZSBIb290ZXJzXCIsIGRlc3RMYXRMbmcsIFwiMm5kIEF2ZVwiLCBob290ZXJzMm5kQXZlLCBcImFyZSB0aGVzZSBvYmplY3RzP1wiKTtcbiAgICB2YXIgZGlzdFNlY29uZEF2ZSA9IGdvb2dsZS5tYXBzLmdlb21ldHJ5LnNwaGVyaWNhbC5jb21wdXRlRGlzdGFuY2VCZXR3ZWVuKGRlc3RMYXRMbmcsIGhvb3RlcnMybmRBdmUpO1xuICAgIHZhciBkaXN0TGViYW5vblBpa2UgPSBnb29nbGUubWFwcy5nZW9tZXRyeS5zcGhlcmljYWwuY29tcHV0ZURpc3RhbmNlQmV0d2VlbihkZXN0TGF0TG5nLCBob290ZXJzTGViYW5vblBpa2UpO1xuICAgIHZhciBkaXN0TGFyZ29Ecml2ZSA9IGdvb2dsZS5tYXBzLmdlb21ldHJ5LnNwaGVyaWNhbC5jb21wdXRlRGlzdGFuY2VCZXR3ZWVuKGRlc3RMYXRMbmcsIGhvb3RlcnNMYXJnb0RyaXZlKTtcbiAgICBob290ZXJzRGlzdGFuY2VzLnB1c2goZGlzdExhcmdvRHJpdmUsIGRpc3RMZWJhbm9uUGlrZSwgZGlzdFNlY29uZEF2ZSk7XG4gICAgdmFyIG5lYXJlc3RIb290ZXJzID0gTWF0aC5taW4uYXBwbHkoTWF0aCwgaG9vdGVyc0Rpc3RhbmNlcyk7XG4gICAgdmFyIGhvb3RlcnNXYXlwb2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChuZWFyZXN0SG9vdGVycyA9PT0gZGlzdFNlY29uZEF2ZSkge1xuICAgICAgICByZXR1cm4gaG9vdGVyczJuZEF2ZTtcbiAgICAgIH0gZWxzZSBpZiAobmVhcmVzdEhvb3RlcnMgPT09IGRpc3RMYXJnb0RyaXZlKSB7XG4gICAgICAgIHJldHVybiBob290ZXJzTGFyZ29Ecml2ZTtcbiAgICAgIH0gZWxzZSBpZiAobmVhcmVzdEhvb3RlcnMgPT09IGRpc3RMZWJhbm9uUGlrZSkge1xuICAgICAgICByZXR1cm4gaG9vdGVyc0xlYmFub25QaWtlO1xuICAgICAgfVxuICAgIH07XG4gICAgaG9vdGVyc1dheXBvaW50KCk7XG4gICAgdmFyIGhvb3RlcnNNYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgIHBvc2l0aW9uOiBob290ZXJzMm5kQXZlLFxuICAgICAgbWFwOiBtYXAsXG4gICAgICBpY29uOiAnaHR0cDovL2Vkd2luYWNldmVkby5jb20vZGlyZWN0aW9uc0Zyb20vaW1nL2hvb3RlcnMtbWFya2VyLnBuZydcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU5vR2VvbG9jYXRpb24oZXJyb3JGbGFnKSB7XG4gICAgaWYgKGVycm9yRmxhZykge1xuICAgICAgdmFyIGNvbnRlbnQgPSAnQXcgc25hcCEgU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgR2VvbG9jYXRpb24gc2VydmljZS4gU29ycnk/JztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNvbnRlbnQgPSAnQXcsIHNuYXAhIFlvdXIgYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBnZW9sb2NhdGlvbi4nO1xuICAgIH1cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIG1hcDogbWFwLFxuICAgICAgcG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoMzYuMTY2NywgODYuNzgzMyksXG4gICAgICBjb250ZW50OiBjb250ZW50XG4gICAgfTtcbiAgICB2YXIgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KG9wdGlvbnMpO1xuICAgIG1hcC5zZXRDZW50ZXIob3B0aW9ucy5wb3NpdGlvbik7XG4gIH1cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvL2F1dG9jb21wbGV0ZSBmb3IgdGhlIHNlYXJjaCBib3hcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG52YXIgcGFjX2lucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3doZXJlVG8nKTtcbihmdW5jdGlvbiBwYWNTZWxlY3RGaXJzdChpbnB1dCkge1xuICAvLyBzdG9yZSB0aGUgb3JpZ2luYWwgZXZlbnQgYmluZGluZyBmdW5jdGlvblxuICB2YXIgX2FkZEV2ZW50TGlzdGVuZXIgPSAoaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcikgPyBpbnB1dC5hZGRFdmVudExpc3RlbmVyIDogaW5wdXQuYXR0YWNoRXZlbnQ7XG5cbiAgZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcldyYXBwZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAvLyBTaW11bGF0ZSBhICdkb3duIGFycm93JyBrZXlwcmVzcyBvbiBoaXR0aW5nICdyZXR1cm4nIHdoZW4gbm8gcGFjIHN1Z2dlc3Rpb24gaXMgc2VsZWN0ZWQsXG4gICAgLy8gYW5kIHRoZW4gdHJpZ2dlciB0aGUgb3JpZ2luYWwgbGlzdGVuZXIuXG4gICAgaWYgKHR5cGUgPT0gXCJrZXlkb3duXCIpIHtcbiAgICAgIHZhciBvcmlnX2xpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgICBsaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgc3VnZ2VzdGlvbl9zZWxlY3RlZCA9ICQoXCIucGFjLWl0ZW0tc2VsZWN0ZWRcIikubGVuZ3RoID4gMDtcbiAgICAgICAgaWYgKGV2ZW50LndoaWNoID09IDEzICYmICFzdWdnZXN0aW9uX3NlbGVjdGVkKSB7XG4gICAgICAgICAgdmFyIHNpbXVsYXRlZF9kb3duYXJyb3cgPSAkLkV2ZW50KFwia2V5ZG93blwiLCB7XG4gICAgICAgICAgICBrZXlDb2RlOiA0MCxcbiAgICAgICAgICAgIHdoaWNoOiA0MFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9yaWdfbGlzdGVuZXIuYXBwbHkoaW5wdXQsIFtzaW11bGF0ZWRfZG93bmFycm93XSk7XG4gICAgICAgIH1cbiAgICAgICAgb3JpZ19saXN0ZW5lci5hcHBseShpbnB1dCwgW2V2ZW50XSk7XG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBhZGQgdGhlIG1vZGlmaWVkIGxpc3RlbmVyXG4gICAgX2FkZEV2ZW50TGlzdGVuZXIuYXBwbHkoaW5wdXQsIFt0eXBlLCBsaXN0ZW5lcl0pO1xuICB9XG4gIGlmIChpbnB1dC5hZGRFdmVudExpc3RlbmVyKVxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIgPSBhZGRFdmVudExpc3RlbmVyV3JhcHBlcjtcbiAgZWxzZSBpZiAoaW5wdXQuYXR0YWNoRXZlbnQpXG4gICAgaW5wdXQuYXR0YWNoRXZlbnQgPSBhZGRFdmVudExpc3RlbmVyV3JhcHBlcjtcbn0pKHBhY19pbnB1dCk7XG4kKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGF1dG9jb21wbGV0ZSA9IG5ldyBnb29nbGUubWFwcy5wbGFjZXMuQXV0b2NvbXBsZXRlKHBhY19pbnB1dCk7XG59KTtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy9kcmF3IHRoZSByb3V0ZSBvbiB0aGUgbWFwXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZnVuY3Rpb24gY2FsY1JvdXRlKHBvcywgZGVzdExhdExuZywgaG9vdGVyc1dheXBvaW50KSB7XG4gIC8vY29uc29sZS5sb2coJ2Nsb3Nlc3RIb290ZXJzJywgY2xvc2VzdEhvb3RlcnMpO1xuICAvL3BsYWNpbmcgdGhlIG93bCwgdGhlc2UgbGluZXMgZnJvbSBoZXJlXG4gIHZhciBtYXJrZXJzID0gW107XG4gIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgIGFkZE1hcmtlcihldmVudC5sYXRMbmcpO1xuICAgfSk7XG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vY2hhbmdpbmcgdGhlIG5hbWUgZnJvbSBtYXJrZXIgdG8gaG9vdGVyc01hcmtlclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBjb25zb2xlLmxvZyhob290ZXJzV2F5cG9pbnQsICdob290ZXJzV2F5cG9pbnQnKVxuICB2YXIgaG9vdGVyc01hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgIHBvc2l0aW9uOiB3YXlwdHMsXG4gICAgbWFwOiBtYXAsXG4gICAgdGl0bGU6ICdTdG9wIGZvciB3aW5ncyBhbmQgYmVlciEnLFxuICAgIGljb246ICdodHRwOi8vZWR3aW5hY2V2ZWRvLmNvbS9kaXJlY3Rpb25zRnJvbS9pbWcvaG9vdGVycy1tYXJrZXIucG5nJ1xuICB9KTtcbiAgbWFya2Vycy5wdXNoKGhvb3RlcnNNYXJrZXIpO1xuICAvLyAjIyMgZW5kIG93bCBtYXJrZXJcbiAgLy9hZGRlZCBpbmZvd2luZG93IGZyb20gaGVyZVxuICAvKnZhciBjb250ZW50U3RyaW5nID0gJzxkaXYgaWQ9XCJjb250ZW50XCI+JyArXG4gICAgJzxoMSBpZD1cImZpcnN0SGVhZGluZ1wiIGNsYXNzPVwiZmlyc3RIZWFkaW5nXCI+U3RvcCBoZXJlIGZvciBiZWVyICYgd2luZ3M8L2gxPicgK1xuICAgICc8L2Rpdj4nOyovXG4gIC8qdmFyIGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG4gICAgY29udGVudDogJ3RoaXMgaXMgYSB0ZXN0ICcsIC8vY29udGVudFN0cmluZyxcbiAgICBtYXhXaWR0aDogMzAwXG4gIH0pOyovXG4gIC8qICB2YXIgaG9vdGVyczJuZEF2ZU1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICBwb3NpdGlvbjogaG9vdGVyczJuZEF2ZSxcbiAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIHRpdGxlOiAnU3RvcCBmb3IgQmVlciBhbmQgV2luZ3MnXG4gICAgfSk7Ki9cbiAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoaG9vdGVyc01hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIGluZm93aW5kb3cub3BlbihtYXAsIGhvb3RlcnNNYXJrZXIpO1xuICAgIGNvbnNvbGUubG9nKCdtYXAgb2JqZWN0OicsIG1hcCwgJ2hvb3RlcnMgbWFya2VyOicsIGhvb3RlcnNNYXJrZXIpO1xuICAgIGFsZXJ0KG1hcCk7XG4gICAgYWxlcnQoaG9vdGVyc01hcmtlcik7XG4gIH0pO1xuICAvLyAjIyMjIGVuZCBpbmZvd2luZG93XG4gIHZhciB3aGVyZVRvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3doZXJlVG8nKS52YWx1ZTtcbiAgdmFyIGhvb3RlcnMybmRBdmUgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDM2LjE2MTg5MTQsIC04Ni43ODk0NjQpO1xuICB2YXIgd2F5cHRzID0gW3tcbiAgICBsb2NhdGlvbjogaG9vdGVyczJuZEF2ZSwgLy90aGlzIGlzIHVuZGVmaW5lZFxuICAgIHN0b3BvdmVyOiB0cnVlXG4gIH1dO1xuICBkaXJlY3Rpb25zRGlzcGxheSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIoIHtcbiAgICAgc3VwcHJlc3NNYXJrZXJzIDogdHJ1ZVxuICB9KTtcbiAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG1hcCk7XG4gIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgdmFyIHBvcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcbiAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgIG9yaWdpbjogcG9zLFxuICAgICAgZGVzdGluYXRpb246IHdoZXJlVG8sIC8vZnJvbSBpbnB1dC52YWx1ZSBvZiAjd2hlcmVUb1xuICAgICAgd2F5cG9pbnRzOiB3YXlwdHMsXG4gICAgICAvL3BsYWNlSWQ6ICdDaElKT3dFN19HVHR3b2tSRnEwdU93TFNFOWcnXG4gICAgICBvcHRpbWl6ZVdheXBvaW50czogZmFsc2UsXG4gICAgICBkaXNwbGF5OiBmYWxzZSxcbiAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLlRyYXZlbE1vZGUuRFJJVklOR1xuICAgIH07XG4gICAgY29uc29sZS5sb2coJ3dheXB0cycsIHdheXB0cyk7XG4gICAgY29uc29sZS5sb2coJ21hcCcsIG1hcCk7XG4gICAgY29uc29sZS5sb2coJ3BvcycsIHBvcyk7XG4gICAgY29uc29sZS5sb2coJ3doZXJlVG8sIHRoaXMgdGltZSBpbmNsdWRpbmcgdGhlIGlucHV0LnZhbHVlJywgd2hlcmVUbyk7XG4gICAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUocmVxdWVzdCwgZnVuY3Rpb24gKHJlc3BvbnNlLCBzdGF0dXMpIHtcbiAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cy5PSykge1xuICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXREaXJlY3Rpb25zKHJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5nb29nbGUubWFwcy5ldmVudC5hZGREb21MaXN0ZW5lcih3aW5kb3csICdsb2FkJywgaW5pdGlhbGl6ZSwgY2FsY1JvdXRlLyosIGNsb3Nlc3RIb290ZXJzKi8pOyAvLywgY2FsY1JvdXRlLCBjbG9zZXN0SG9vdGVyc1xuIl19
