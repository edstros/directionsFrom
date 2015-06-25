'use strict';

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
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
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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

function calcRoute() {

  console.log(map + 'line 114'); // returns [object Object]
  var input = document.querySelector('#whereTo');
  var whereTo = input.value;
  var hooters2ndAve = new google.maps.LatLng(36.164563, -86.776568);
  //var hooters2ndAve =  {    placeId: 'ChIJH_4dHFpmZIgR5zLArMUmS0c'  };//this is place_Id
  var waypts = [{
    location: hooters2ndAve,
    stopover: true
  }];
  /*  function addHooters () {
      var hooters2ndAve = new google.maps.LatLng(36.1646,-86.7766);
    waypoints.push()/*blah, blah, blah;*/

  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  navigator.geolocation.getCurrentPosition(function (position) {
    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var request = {
      origin: pos, //from geolocation
      destination: whereTo, //from input.value of #whereTo
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING
    };
    // console.log(waypts);
    console.log(map);
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
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUMiLCJmaWxlIjoic3JjL2pzL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZGlyZWN0aW9uc0Rpc3BsYXk7XG52YXIgZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UoKTtcbnZhciBtYXA7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vc3RhcnQgdGhlIHBhcnR5XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgdmFyIG1hcENhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtY2FudmFzJyk7IC8vZGl2IGluIHRoZSBodG1sXG4gIHZhciBtYXBPcHRpb25zID0ge1xuICAgIGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZygzNi4xNjY3LCA4Ni43ODMzKSwgLy9OYXNoVmVnYXMsIFROXG4gICAgem9vbTogMTUsXG4gICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcbiAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gIH1cbiAgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChtYXBDYW52YXMsIG1hcE9wdGlvbnMpO1xuICBjb25zb2xlLmxvZyhtYXApOyAvL3RoaXMgd29ya3MsIHByb2R1Y2VzIG1hcCBvYmplY3RcbiAgLy8gVHJ5IEhUTUw1IGdlb2xvY2F0aW9uXG4gIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgICAgdmFyIHBvcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcbiAgICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgcG9zaXRpb246IHBvcyxcbiAgICAgICAgcGl4ZWxPZmZzZXQ6IG5ldyBnb29nbGUubWFwcy5TaXplKDAsIC0yMCksXG4gICAgICAgIGNvbnRlbnQ6ICdTdGFydCBoZXJlJ1xuICAgICAgfSk7XG4gICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgIG1hcDogbWFwLFxuICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxuICAgICAgICB0aXRsZTogJ1RoaXMgaXMgeW91ciBnZW9sb2NhdGlvbidcbiAgICAgIH0pO1xuICAgICAgLy9jb3BpZWQgdGhlIG5leHQgc2l4IGxpbmVzIGZyb20gZ29vZ2xlLCBub3QgZ29ubmEgbGllXG4gICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIHRvZ2dsZUJvdW5jZSk7XG4gICAgICBmdW5jdGlvbiB0b2dnbGVCb3VuY2UoKSB7XG4gICAgICAgIGlmIChtYXJrZXIuZ2V0QW5pbWF0aW9uKCkgIT09IG51bGwpIHtcbiAgICAgICAgICBtYXJrZXIuc2V0QW5pbWF0aW9uKG51bGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hcmtlci5zZXRBbmltYXRpb24oZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkJPVU5DRSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpbmZvd2luZG93Lm9wZW4obWFwLCBtYXJrZXIpOyAvL3RoaXMgc2hvdWxkIGJlIHJlZG9uZSBpbiB0aGUgaW5mb2JveCBjbGFzc1xuICAgICAgfSk7XG4gICAgICBtYXAuc2V0Q2VudGVyKHBvcyk7XG4gICAgICAvL3JlZmFjdG9yZWQgY29kZSBmcm9tIHdlYXRoZXIgYXBwXG4gICAgICB2YXIgYnRuV2hlcmVUbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidG5XaGVyZVRvJyk7IC8vY3JlYXRlcyB0aGUgYnV0dG9uIGVsZW1lbnQgdXNpbmcgdGhlIGlkIGZyb20gdGhlIGJ1dHRvbiBpbnB1dFxuICAgICAgYnRuV2hlcmVUby5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjYWxjUm91dGUoKTtcbiAgICAgIH07XG4gICAgICAvL2FkZHMgdGhlIGNhbGNyb3V0ZSB3aXRoaW4gZ2VvbG9jYXRpb24gYmVjYXVzZSBnZW9sb2NhdGlvbiBpcyB0aGUgc3RhcnRpbmcgcG9pbnRcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBoYW5kbGVOb0dlb2xvY2F0aW9uKHRydWUpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IEdlb2xvY2F0aW9uXG4gICAgaGFuZGxlTm9HZW9sb2NhdGlvbihmYWxzZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGhhbmRsZU5vR2VvbG9jYXRpb24oZXJyb3JGbGFnKSB7XG4gICAgaWYgKGVycm9yRmxhZykge1xuICAgICAgdmFyIGNvbnRlbnQgPSAnQXcgc25hcCEgU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgR2VvbG9jYXRpb24gc2VydmljZS4gU29ycnk/JztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNvbnRlbnQgPSAnQXcsIHNuYXAhIFlvdXIgYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBnZW9sb2NhdGlvbi4nO1xuICAgIH1cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIG1hcDogbWFwLFxuICAgICAgcG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoMzYuMTY2NywgODYuNzgzMyksXG4gICAgICBjb250ZW50OiBjb250ZW50XG4gICAgfTtcbiAgICB2YXIgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KG9wdGlvbnMpO1xuICAgIG1hcC5zZXRDZW50ZXIob3B0aW9ucy5wb3NpdGlvbik7XG4gIH1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy9hdXRvY29tcGxldGUgZm9yIHRoZSBzZWFyY2ggYm94XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxudmFyIHBhY19pbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3aGVyZVRvJyk7XG4oZnVuY3Rpb24gcGFjU2VsZWN0Rmlyc3QoaW5wdXQpIHtcbiAgLy8gc3RvcmUgdGhlIG9yaWdpbmFsIGV2ZW50IGJpbmRpbmcgZnVuY3Rpb25cbiAgdmFyIF9hZGRFdmVudExpc3RlbmVyID0gKGlucHV0LmFkZEV2ZW50TGlzdGVuZXIpID8gaW5wdXQuYWRkRXZlbnRMaXN0ZW5lciA6IGlucHV0LmF0dGFjaEV2ZW50O1xuICBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyV3JhcHBlcih0eXBlLCBsaXN0ZW5lcikge1xuICAgIC8vIFNpbXVsYXRlIGEgJ2Rvd24gYXJyb3cnIGtleXByZXNzIG9uIGhpdHRpbmcgJ3JldHVybicgd2hlbiBubyBwYWMgc3VnZ2VzdGlvbiBpcyBzZWxlY3RlZCxcbiAgICAvLyBhbmQgdGhlbiB0cmlnZ2VyIHRoZSBvcmlnaW5hbCBsaXN0ZW5lci5cbiAgICBpZiAodHlwZSA9PSBcImtleWRvd25cIikge1xuICAgICAgdmFyIG9yaWdfbGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgICAgIGxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBzdWdnZXN0aW9uX3NlbGVjdGVkID0gJChcIi5wYWMtaXRlbS1zZWxlY3RlZFwiKS5sZW5ndGggPiAwO1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMTMgJiYgIXN1Z2dlc3Rpb25fc2VsZWN0ZWQpIHtcbiAgICAgICAgICB2YXIgc2ltdWxhdGVkX2Rvd25hcnJvdyA9ICQuRXZlbnQoXCJrZXlkb3duXCIsIHtcbiAgICAgICAgICAgIGtleUNvZGU6IDQwLFxuICAgICAgICAgICAgd2hpY2g6IDQwXG4gICAgICAgICAgfSlcbiAgICAgICAgICBvcmlnX2xpc3RlbmVyLmFwcGx5KGlucHV0LCBbc2ltdWxhdGVkX2Rvd25hcnJvd10pO1xuICAgICAgICB9XG4gICAgICAgIG9yaWdfbGlzdGVuZXIuYXBwbHkoaW5wdXQsIFtldmVudF0pO1xuICAgICAgfTtcbiAgICB9XG4gICAgLy8gYWRkIHRoZSBtb2RpZmllZCBsaXN0ZW5lclxuICAgIF9hZGRFdmVudExpc3RlbmVyLmFwcGx5KGlucHV0LCBbdHlwZSwgbGlzdGVuZXJdKTtcbiAgfVxuICBpZiAoaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcilcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyID0gYWRkRXZlbnRMaXN0ZW5lcldyYXBwZXI7XG4gIGVsc2UgaWYgKGlucHV0LmF0dGFjaEV2ZW50KVxuICAgIGlucHV0LmF0dGFjaEV2ZW50ID0gYWRkRXZlbnRMaXN0ZW5lcldyYXBwZXI7XG59KShwYWNfaW5wdXQpO1xuJChmdW5jdGlvbiAoKSB7XG4gIHZhciBhdXRvY29tcGxldGUgPSBuZXcgZ29vZ2xlLm1hcHMucGxhY2VzLkF1dG9jb21wbGV0ZShwYWNfaW5wdXQpO1xufSk7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vZHJhdyB0aGUgcm91dGUgb24gdGhlIG1hcFxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gY2FsY1JvdXRlKCkge1xuICBcbiAgY29uc29sZS5sb2cobWFwICsgXCJsaW5lIDExNFwiKTsgLy8gcmV0dXJucyBbb2JqZWN0IE9iamVjdF1cbiAgdmFyIGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3doZXJlVG8nKTtcbiAgdmFyIHdoZXJlVG8gPSBpbnB1dC52YWx1ZTtcbiAgdmFyIGhvb3RlcnMybmRBdmUgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDM2LjE2NDU2MywgLTg2Ljc3NjU2OCk7XG4gIC8vdmFyIGhvb3RlcnMybmRBdmUgPSAgeyAgICBwbGFjZUlkOiAnQ2hJSkhfNGRIRnBtWklnUjV6TEFyTVVtUzBjJyAgfTsvL3RoaXMgaXMgcGxhY2VfSWRcbiAgdmFyIHdheXB0cyA9IFt7XG4gICAgbG9jYXRpb246IGhvb3RlcnMybmRBdmUsXG4gICAgc3RvcG92ZXI6IHRydWVcbiAgfV07XG4gIC8qICBmdW5jdGlvbiBhZGRIb290ZXJzICgpIHtcbiAgICAgIHZhciBob290ZXJzMm5kQXZlID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZygzNi4xNjQ2LC04Ni43NzY2KTtcbiAgICB3YXlwb2ludHMucHVzaCgpLypibGFoLCBibGFoLCBibGFoOyovXG4gIFxuICBkaXJlY3Rpb25zRGlzcGxheSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIoKTtcbiAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG1hcCk7XG4gIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgdmFyIHBvcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcbiAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgIG9yaWdpbjogcG9zLCAvL2Zyb20gZ2VvbG9jYXRpb25cbiAgICAgIGRlc3RpbmF0aW9uOiB3aGVyZVRvLCAvL2Zyb20gaW5wdXQudmFsdWUgb2YgI3doZXJlVG9cbiAgICAgIHdheXBvaW50czogd2F5cHRzLFxuICAgICAgb3B0aW1pemVXYXlwb2ludHM6IGZhbHNlLFxuICAgICAgdHJhdmVsTW9kZTogZ29vZ2xlLm1hcHMuVHJhdmVsTW9kZS5EUklWSU5HXG4gICAgfTtcbiAgICAvLyBjb25zb2xlLmxvZyh3YXlwdHMpO1xuICAgIGNvbnNvbGUubG9nKG1hcCk7XG4gICAgY29uc29sZS5sb2cocG9zKTtcbiAgICBjb25zb2xlLmxvZyh3aGVyZVRvKTtcbiAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZShyZXF1ZXN0LCBmdW5jdGlvbiAocmVzcG9uc2UsIHN0YXR1cykge1xuICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKSB7XG4gICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldERpcmVjdGlvbnMocmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn07XG5nb29nbGUubWFwcy5ldmVudC5hZGREb21MaXN0ZW5lcih3aW5kb3csICdsb2FkJywgaW5pdGlhbGl6ZSwgY2FsY1JvdXRlKTtcbiJdfQ==
