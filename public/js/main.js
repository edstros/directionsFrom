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
    center: new google.maps.LatLng(36.1667, 86.7833), //NashVegas, TN
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false };
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

    var hooters2ndAve = new google.maps.LatLng(36.1618914, -86.789464);
    var hootersLebanonPike = new google.maps.LatLng(36.18633370000001, -86.63314799999999);
    var hootersLargoDrive = new google.maps.LatLng(36.081514, -86.7095413);
    var distSecondAve = google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hooters2ndAve);
    var distLebanonPike = google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hootersLebanonPike);
    var distLargoDrive = google.maps.geometry.spherical.computeDistanceBetween(destLatLng, hootersLargoDrive);
    console.dir(Number(distSecondAve));
    var hootersWaypoint = distances.push(distLargoDrive, distLebanonPike, distSecondAve).Math.min.apply(null, distances);
    console.log(hootersWaypoint);return hootersWaypoint;
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
//# sourceMappingURL=data:application/json;base64,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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCcEIsV0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQixXQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFdBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckIsV0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2hDLHFCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxRQUFRLEVBQUUsTUFBTSxFQUFFO0FBQzNELFVBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFO0FBQzdDLHlCQUFpQixDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUMzQztLQUNGLENBQUMsQ0FBQzs7R0FFSixDQUFDLENBQUM7Q0FDSjtBQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyIsImZpbGUiOiJzcmMvanMvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBkaXJlY3Rpb25zRGlzcGxheTtcbnZhciBkaXJlY3Rpb25zU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSgpO1xudmFyIG1hcDtcbnZhciBwb3M7XG52YXIgZGVzdExhdExuZztcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy9zdGFydCB0aGUgcGFydHlcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgdmFyIG1hcENhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtY2FudmFzJyk7IC8vZGl2IGluIHRoZSBodG1sXG4gIHZhciBtYXBPcHRpb25zID0ge1xuICAgIGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZygzNi4xNjY3LCA4Ni43ODMzKSwgLy9OYXNoVmVnYXMsIFROXG4gICAgem9vbTogMTUsXG4gICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcbiAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gIH07XG4gIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAobWFwQ2FudmFzLCBtYXBPcHRpb25zKTtcbiAgY29uc29sZS5sb2cobWFwKTsgLy90aGlzIHdvcmtzLCBwcm9kdWNlcyBtYXAgb2JqZWN0XG4gIC8vIFRyeSBIVE1MNSBnZW9sb2NhdGlvblxuICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XG4gICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgIHBvcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcbiAgICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgcG9zaXRpb246IHBvcyxcbiAgICAgICAgcGl4ZWxPZmZzZXQ6IG5ldyBnb29nbGUubWFwcy5TaXplKDAsIC0yMCksXG4gICAgICAgIGNvbnRlbnQ6ICdTdGFydCBoZXJlJ1xuICAgICAgfSk7XG4gICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgIG1hcDogbWFwLFxuICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxuICAgICAgICB0aXRsZTogJ1RoaXMgaXMgeW91ciBnZW9sb2NhdGlvbidcbiAgICAgIH0pO1xuICAgICAgLy9jb3BpZWQgdGhlIG5leHQgc2l4IGxpbmVzIGZyb20gZ29vZ2xlLCBub3QgZ29ubmEgbGllXG4gICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIHRvZ2dsZUJvdW5jZSk7XG5cbiAgICAgIGZ1bmN0aW9uIHRvZ2dsZUJvdW5jZSgpIHtcbiAgICAgICAgaWYgKG1hcmtlci5nZXRBbmltYXRpb24oKSAhPT0gbnVsbCkge1xuICAgICAgICAgIG1hcmtlci5zZXRBbmltYXRpb24obnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFya2VyLnNldEFuaW1hdGlvbihnb29nbGUubWFwcy5BbmltYXRpb24uQk9VTkNFKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGluZm93aW5kb3cub3BlbihtYXAsIG1hcmtlcik7IC8vdGhpcyBzaG91bGQgYmUgcmVkb25lIGluIHRoZSBpbmZvYm94IGNsYXNzXG4gICAgICB9KTtcbiAgICAgIG1hcC5zZXRDZW50ZXIocG9zKTtcbiAgICAgIGNvbnNvbGUubG9nKG1hcCk7XG4gICAgICAvL3JlZmFjdG9yZWQgY29kZSBmcm9tIHdlYXRoZXIgYXBwXG4gICAgICB2YXIgYnRuV2hlcmVUbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidG5XaGVyZVRvJyk7IC8vY3JlYXRlcyB0aGUgYnV0dG9uIGVsZW1lbnQgdXNpbmcgdGhlIGlkIGZyb20gdGhlIGJ1dHRvbiBpbnB1dFxuICAgICAgYnRuV2hlcmVUby5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjbG9zZXN0SG9vdGVycygpO1xuICAgICAgICBjYWxjUm91dGUocG9zKTtcbiAgICAgIH07XG4gICAgICAvL2FkZHMgdGhlIGNhbGNyb3V0ZSB3aXRoaW4gZ2VvbG9jYXRpb24gYmVjYXVzZSBnZW9sb2NhdGlvbiBpcyB0aGUgc3RhcnRpbmcgcG9pbnRcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBoYW5kbGVOb0dlb2xvY2F0aW9uKHRydWUpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IEdlb2xvY2F0aW9uXG4gICAgaGFuZGxlTm9HZW9sb2NhdGlvbihmYWxzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2xvc2VzdEhvb3RlcnMoKSB7XG4gIHZhciBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3aGVyZVRvJyk7XG4gIHZhciB3aGVyZVRvID0gaW5wdXQudmFsdWU7XG4gIHZhciBkZXN0aW5hdGlvbkFkZHJlc3MgPSB3aGVyZVRvLnNwbGl0KCcgJykuam9pbignKycpO1xuICB2YXIgTUFQU19VUkwgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9hZGRyZXNzPSc7XG4gICQuZ2V0KE1BUFNfVVJMICsgZGVzdGluYXRpb25BZGRyZXNzLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBkaXN0YW5jZXMgPSBbXTtcbiAgICB2YXIgZGVzdExhdCA9IGRhdGEucmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQ7XG4gICAgdmFyIGRlc3RMbmcgPSBkYXRhLnJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nO1xuICAgIHZhciBkZXN0TGF0TG5nID0gZGVzdExhdCArICcsJyArIGRlc3RMbmc7XG4gICAgY29uc29sZS5sb2coZGVzdExhdExuZyk7XG5cbiAgICB2YXIgaG9vdGVyczJuZEF2ZSA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoMzYuMTYxODkxNCwtODYuNzg5NDY0KTtcbiAgICB2YXIgaG9vdGVyc0xlYmFub25QaWtlID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZygzNi4xODYzMzM3MDAwMDAwMSwtODYuNjMzMTQ3OTk5OTk5OTkpO1xuICAgIHZhciBob290ZXJzTGFyZ29Ecml2ZSA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoMzYuMDgxNTE0LC04Ni43MDk1NDEzKTtcbiAgICB2YXIgZGlzdFNlY29uZEF2ZSA9IGdvb2dsZS5tYXBzLmdlb21ldHJ5LnNwaGVyaWNhbC5jb21wdXRlRGlzdGFuY2VCZXR3ZWVuKGRlc3RMYXRMbmcsIGhvb3RlcnMybmRBdmUpO1xuICAgIHZhciBkaXN0TGViYW5vblBpa2UgPSAgZ29vZ2xlLm1hcHMuZ2VvbWV0cnkuc3BoZXJpY2FsLmNvbXB1dGVEaXN0YW5jZUJldHdlZW4oZGVzdExhdExuZywgaG9vdGVyc0xlYmFub25QaWtlKTtcbiAgICB2YXIgZGlzdExhcmdvRHJpdmUgPSAgZ29vZ2xlLm1hcHMuZ2VvbWV0cnkuc3BoZXJpY2FsLmNvbXB1dGVEaXN0YW5jZUJldHdlZW4oZGVzdExhdExuZywgaG9vdGVyc0xhcmdvRHJpdmUpO1xuICAgIGNvbnNvbGUuZGlyKE51bWJlcihkaXN0U2Vjb25kQXZlKSk7XG4gICAgdmFyIGhvb3RlcnNXYXlwb2ludCA9IGRpc3RhbmNlcy5wdXNoKGRpc3RMYXJnb0RyaXZlLCBkaXN0TGViYW5vblBpa2UsIGRpc3RTZWNvbmRBdmUpLk1hdGgubWluLmFwcGx5KG51bGwsIGRpc3RhbmNlcyk7XG4gICAgIGNvbnNvbGUubG9nKGhvb3RlcnNXYXlwb2ludCk7ICByZXR1cm4gaG9vdGVyc1dheXBvaW50O1xuIFxuICB9KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlTm9HZW9sb2NhdGlvbihlcnJvckZsYWcpIHtcbiAgICBpZiAoZXJyb3JGbGFnKSB7XG4gICAgICB2YXIgY29udGVudCA9ICdBdyBzbmFwISBTb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIHRoZSBHZW9sb2NhdGlvbiBzZXJ2aWNlLiBTb3JyeT8nO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgY29udGVudCA9ICdBdywgc25hcCEgWW91ciBicm93c2VyIGRvZXNuXFwndCBzdXBwb3J0IGdlb2xvY2F0aW9uLic7XG4gICAgfVxuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgbWFwOiBtYXAsXG4gICAgICBwb3NpdGlvbjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZygzNi4xNjY3LCA4Ni43ODMzKSxcbiAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcbiAgICB9O1xuICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3cob3B0aW9ucyk7XG4gICAgbWFwLnNldENlbnRlcihvcHRpb25zLnBvc2l0aW9uKTtcbiAgfVxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vYXV0b2NvbXBsZXRlIGZvciB0aGUgc2VhcmNoIGJveFxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbnZhciBwYWNfaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2hlcmVUbycpO1xuKGZ1bmN0aW9uIHBhY1NlbGVjdEZpcnN0KGlucHV0KSB7XG4gIC8vIHN0b3JlIHRoZSBvcmlnaW5hbCBldmVudCBiaW5kaW5nIGZ1bmN0aW9uXG4gIHZhciBfYWRkRXZlbnRMaXN0ZW5lciA9IChpbnB1dC5hZGRFdmVudExpc3RlbmVyKSA/IGlucHV0LmFkZEV2ZW50TGlzdGVuZXIgOiBpbnB1dC5hdHRhY2hFdmVudDtcblxuICBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyV3JhcHBlcih0eXBlLCBsaXN0ZW5lcikge1xuICAgIC8vIFNpbXVsYXRlIGEgJ2Rvd24gYXJyb3cnIGtleXByZXNzIG9uIGhpdHRpbmcgJ3JldHVybicgd2hlbiBubyBwYWMgc3VnZ2VzdGlvbiBpcyBzZWxlY3RlZCxcbiAgICAvLyBhbmQgdGhlbiB0cmlnZ2VyIHRoZSBvcmlnaW5hbCBsaXN0ZW5lci5cbiAgICBpZiAodHlwZSA9PSBcImtleWRvd25cIikge1xuICAgICAgdmFyIG9yaWdfbGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgICAgIGxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBzdWdnZXN0aW9uX3NlbGVjdGVkID0gJChcIi5wYWMtaXRlbS1zZWxlY3RlZFwiKS5sZW5ndGggPiAwO1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMTMgJiYgIXN1Z2dlc3Rpb25fc2VsZWN0ZWQpIHtcbiAgICAgICAgICB2YXIgc2ltdWxhdGVkX2Rvd25hcnJvdyA9ICQuRXZlbnQoXCJrZXlkb3duXCIsIHtcbiAgICAgICAgICAgIGtleUNvZGU6IDQwLFxuICAgICAgICAgICAgd2hpY2g6IDQwXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgb3JpZ19saXN0ZW5lci5hcHBseShpbnB1dCwgW3NpbXVsYXRlZF9kb3duYXJyb3ddKTtcbiAgICAgICAgfVxuICAgICAgICBvcmlnX2xpc3RlbmVyLmFwcGx5KGlucHV0LCBbZXZlbnRdKTtcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIGFkZCB0aGUgbW9kaWZpZWQgbGlzdGVuZXJcbiAgICBfYWRkRXZlbnRMaXN0ZW5lci5hcHBseShpbnB1dCwgW3R5cGUsIGxpc3RlbmVyXSk7XG4gIH1cbiAgaWYgKGlucHV0LmFkZEV2ZW50TGlzdGVuZXIpXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lciA9IGFkZEV2ZW50TGlzdGVuZXJXcmFwcGVyO1xuICBlbHNlIGlmIChpbnB1dC5hdHRhY2hFdmVudClcbiAgICBpbnB1dC5hdHRhY2hFdmVudCA9IGFkZEV2ZW50TGlzdGVuZXJXcmFwcGVyO1xufSkocGFjX2lucHV0KTtcbiQoZnVuY3Rpb24gKCkge1xuICB2YXIgYXV0b2NvbXBsZXRlID0gbmV3IGdvb2dsZS5tYXBzLnBsYWNlcy5BdXRvY29tcGxldGUocGFjX2lucHV0KTtcbn0pO1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL2RyYXcgdGhlIHJvdXRlIG9uIHRoZSBtYXBcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5mdW5jdGlvbiBjYWxjUm91dGUocG9zLCBkZXN0TGF0TG5nLCBob290ZXJzV2F5cG9pbnQpIHtcbiAgdmFyIHdheXB0cyA9IFt7XG4gICAgICBsb2NhdGlvbjogaG9vdGVyc1dheXBvaW50LCAvL3RoaXMgaXMgdW5kZWZpbmVkXG4gICAgICBzdG9wb3ZlcjogdHJ1ZVxuICB9XTsgLy92YXIgTUFQU19VUkwgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9hZGRyZXNzPSc7XG4gIC8qdmFyIGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3doZXJlVG8nKTtcbiAgdmFyIHdoZXJlVG8gPSBpbnB1dC52YWx1ZTtcbiAgdmFyIGRlc3RpbmF0aW9uQWRkcmVzcyA9IHdoZXJlVG8uc3BsaXQoJyAnKS5qb2luKCcrJyk7Ki9cbiAgLyogIHZhciBob290ZXJzMm5kQXZlID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZygzNi4xNjE4OTE0LCAtODYuNzg5NDY0KTtcbiAgICB2YXIgaG9vdGVyc0xlYmFub25QaWtlID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZygzNi4xODYzMzM3MDAwMDAwMSwgLTg2LjYzMzE0Nzk5OTk5OTk5KTtcbiAgICB2YXIgaG9vdGVyc0xhcmdvRHJpdmUgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDM2LjA4MTUxNCwgLTg2LjcwOTU0MTMpOyovXG4gIC8vIHZhciBtaWRUbkhvb3RlcnMgPSBbaG9vdGVyc0xlYmFub25QaWtlLCBob290ZXJzMm5kQXZlLCBob290ZXJzTGFyZ29Ecml2ZV07XG4gIC8vdmFyIGhvb3RlcnMybmRBdmUgPSAgbmV3Lmdvb2dsZS5tYXBzLnBsYWNlLnBsYWNlX2lkKCdDaElKSF80ZEhGcG1aSWdSNXpMQXJNVW1TMGMnKTsvL3RoaXMgaXMgcGxhY2VfSWRcbiAgLyogIGZ1bmN0aW9uIGFkZEhvb3RlcnMgKCkge1xuICAgICAgdmFyIGhvb3RlcnMybmRBdmUgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDM2LjE2NDYsLTg2Ljc3NjYpO1xuICAgIHdheXBvaW50cy5wdXNoKCkvKmJsYWgsIGJsYWgsIGJsYWg7Ki9cbiAgLy8gdmFyIHBvcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zKTtcbiAgdmFyIHJlcXVlc3QgPSB7XG4gICAgb3JpZ2luOiBwb3MsIC8vZnJvbSBnZW9sb2NhdGlvblxuICAgIGRlc3RpbmF0aW9uOiB3aGVyZVRvLCAvL2Zyb20gaW5wdXQudmFsdWUgb2YgI3doZXJlVG9cbiAgICB3YXlwb2ludHM6IHdheXB0cyxcbiAgICAvL3BsYWNlSWQ6ICdDaElKT3dFN19HVHR3b2tSRnEwdU93TFNFOWcnXG4gICAgb3B0aW1pemVXYXlwb2ludHM6IGZhbHNlLFxuICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLlRyYXZlbE1vZGUuRFJJVklOR1xuICB9O1xuICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZShyZXF1ZXN0LCBmdW5jdGlvbiAocmVzcG9uc2UsIHN0YXR1cykge1xuICAgIGRpcmVjdGlvbnNEaXNwbGF5ID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcigpO1xuICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChtYXApO1xuICAgIC8vICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgXG4gICAgY29uc29sZS5sb2cod2F5cHRzKTtcbiAgICAvLyB2YXIgcG9zID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xuLyogICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICBvcmlnaW46IHBvcywgLy9mcm9tIGdlb2xvY2F0aW9uXG4gICAgICBkZXN0aW5hdGlvbjogd2hlcmVUbywgLy9mcm9tIGlucHV0LnZhbHVlIG9mICN3aGVyZVRvXG4gICAgICB3YXlwb2ludHM6IHdheXB0cyxcbiAgICAgIG9wdGltaXplV2F5cG9pbnRzOiBmYWxzZSxcbiAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLlRyYXZlbE1vZGUuRFJJVklOR1xuICAgIH07Ki9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy90aGlzIG5leHQgZnVuY3Rpb24gYnJva2UgbXkgYXBwXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VzdEhvb3RlcnMpO1xuICAgIC8qICAgIHZhciBjbG9zZXN0SG9vdGVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkLmdldChNQVBTX1VSTCArIGRlc3RpbmF0aW9uQWRkcmVzcywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBkZXN0TGF0ID0gZGF0YS5yZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxhdDtcbiAgICAgICAgICAgIHZhciBkZXN0TG5nID0gZGF0YS5yZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxuZztcbiAgICAgICAgICAgIHZhciBkZXN0TGF0TG5nID0gZGVzdExhdCArICcsJyArIGRlc3RMbmc7XG4gICAgICAgICAgICB2YXIgZGlzdFNlY29uZEF2ZSA9IG5ldyBnb29nbGUubWFwcy5nZW9tZXRyeS5zcGhlcmljYWwuY29tcHV0ZURpc3RhbmNlQmV0d2VlbihkZXN0TGF0TG5nLCBob290ZXJzMm5kQXZlKTtcbiAgICAgICAgICAgIHZhciBkaXN0TGViYW5vblBpa2UgPSBuZXcgZ29vZ2xlLm1hcHMuZ2VvbWV0cnkuc3BoZXJpY2FsLmNvbXB1dGVEaXN0YW5jZUJldHdlZW4oZGVzdExhdExuZywgaG9vdGVyc0xlYmFub25QaWtlKTtcbiAgICAgICAgICAgIHZhciBkaXN0TGFyZ29Ecml2ZSA9IG5ldyBnb29nbGUubWFwcy5nZW9tZXRyeS5zcGhlcmljYWwuY29tcHV0ZURpc3RhbmNlQmV0d2VlbihkZXN0TGF0TG5nLCBob290ZXJzTGFyZ29Ecml2ZSk7XG4gICAgICAgICAgICBkaXN0YW5jZXMucHVzaChkaXN0TGFyZ29Ecml2ZSwgZGlzdExlYmFub25QaWtlLCBkaXN0U2Vjb25kQXZlKS5NYXRoLm1pbi5hcHBseShudWxsLCBkaXN0YW5jZXMpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZGlzdGFuY2VzKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRpc3RMYXJnb0RyaXZlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSovXG4gXG4gICAgY29uc29sZS5sb2cobWFwKTtcbiAgICBjb25zb2xlLmxvZyhwb3MpO1xuICAgIGNvbnNvbGUubG9nKHdoZXJlVG8pO1xuICAgIGNvbnNvbGUubG9nKGRlc3RpbmF0aW9uQWRkcmVzcyk7XG4gICAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUocmVxdWVzdCwgZnVuY3Rpb24gKHJlc3BvbnNlLCBzdGF0dXMpIHtcbiAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cy5PSykge1xuICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXREaXJlY3Rpb25zKHJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyB9KTtcbiAgfSk7XG59XG5nb29nbGUubWFwcy5ldmVudC5hZGREb21MaXN0ZW5lcih3aW5kb3csICdsb2FkJywgaW5pdGlhbGl6ZSwgY2FsY1JvdXRlKTtcbiJdfQ==
