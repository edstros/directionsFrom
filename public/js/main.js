'use strict';

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
  };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9qcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxpQkFBaUIsQ0FBQztBQUN0QixJQUFJLGlCQUFpQixHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQzVELElBQUksR0FBRyxDQUFDOztBQUVSLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFDLENBQUM7O0FBRTVDLFNBQVMsVUFBVSxHQUFHO0FBQ3BCLE1BQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEQsTUFBSSxVQUFVLEdBQUc7QUFDZixVQUFNLEVBQUUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO0FBQ2hELFFBQUksRUFBRSxFQUFFO0FBQ1IsYUFBUyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU87R0FDekMsQ0FBQTtBQUNELEtBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNqRCxTQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVqQixNQUFJLFNBQVMsQ0FBQyxXQUFXLEVBQUU7QUFDekIsYUFBUyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLFFBQVEsRUFBRTtBQUMzRCxVQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEYsVUFBSSxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUMxQyxXQUFHLEVBQUUsR0FBRztBQUNSLGdCQUFRLEVBQUUsR0FBRztBQUNiLG1CQUFXLEVBQUUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDekMsZUFBTyxFQUFFLDBCQUEwQjtPQUNwQyxDQUFDLENBQUM7QUFDSCxVQUFJLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ2xDLGdCQUFRLEVBQUUsR0FBRztBQUNiLFdBQUcsRUFBRSxHQUFHO0FBQ1IsaUJBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQ3JDLGFBQUssRUFBRSx1QkFBdUI7T0FDL0IsQ0FBQyxDQUFDOztBQUVILFlBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDOztBQUU3RCxlQUFTLFlBQVksR0FBRztBQUN0QixZQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUUsS0FBSyxJQUFJLEVBQUU7QUFDbEMsZ0JBQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDM0IsTUFBTTtBQUNMLGdCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ25EO09BQ0Y7QUFDRCxZQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxZQUFZO0FBQ3pELGtCQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztPQUM5QixDQUFDLENBQUM7QUFDSCxTQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVuQixVQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3ZELGdCQUFVLENBQUMsT0FBTyxHQUFHLFlBQVk7QUFDL0IsaUJBQVMsRUFBRSxDQUFDO09BQ2IsQ0FBQzs7S0FFSCxFQUFFLFlBQVk7QUFDYix5QkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMzQixDQUFDLENBQUM7R0FDSixNQUFNOztBQUVMLHVCQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQzVCO0NBQ0Y7O0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUU7QUFDdEMsTUFBSSxTQUFTLEVBQUU7QUFDYixRQUFJLE9BQU8sR0FBRyxvRUFBb0UsQ0FBQztHQUNwRixNQUFNO0FBQ0wsUUFBSSxPQUFPLEdBQUcsc0RBQXNELENBQUM7R0FDdEU7O0FBRUQsTUFBSSxPQUFPLEdBQUc7QUFDWixPQUFHLEVBQUUsR0FBRztBQUNSLFlBQVEsRUFBRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7QUFDbEQsV0FBTyxFQUFFLE9BQU87R0FDakIsQ0FBQztBQUNGLE1BQUksVUFBVSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckQsS0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Q0FDakM7QUFDRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxDQUFDOztBQUU5QyxTQUFTLFNBQVMsR0FBRztBQUNuQixNQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pELE1BQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDeEIsbUJBQWlCLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7QUFDekQsbUJBQWlCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLFdBQVMsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsVUFBVSxRQUFRLEVBQUU7QUFDM0QsUUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RGLFFBQUksT0FBTyxHQUFHO0FBQ1osWUFBTSxFQUFFLEdBQUc7QUFDWCxpQkFBVyxFQUFFLE9BQU87QUFDcEIsZ0JBQVUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPO0tBQzNDLENBQUM7QUFDRixXQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFdBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckIscUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLFFBQVEsRUFBRSxNQUFNLEVBQUU7QUFDM0QsVUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUU7QUFDN0MseUJBQWlCLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQzNDO0tBQ0YsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQztBQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyIsImZpbGUiOiJzcmMvanMvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBkaXJlY3Rpb25zRGlzcGxheTtcbnZhciBkaXJlY3Rpb25zU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSgpO1xudmFyIG1hcDtcblxuY29uc29sZS5sb2cod2hlcmVUbyArICd0b3Agb2YgdGhlIGpzIGZpbGUnKTtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgdmFyIG1hcENhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtY2FudmFzJyk7IC8vZGl2IGluIHRoZSBodG1sXG4gIHZhciBtYXBPcHRpb25zID0ge1xuICAgIGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZygzNi4xNjY3LCA4Ni43ODMzKSwgLy9OYXNoVmVnYXMsIFROXG4gICAgem9vbTogMTUsXG4gICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUFxuICB9XG4gIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAobWFwQ2FudmFzLCBtYXBPcHRpb25zKTtcbiAgY29uc29sZS5sb2cobWFwKTsgLy90aGlzIHdvcmtzLCBwcm9kdWNlcyBtYXAgb2JqZWN0XG4gIC8vIFRyeSBIVE1MNSBnZW9sb2NhdGlvblxuICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XG4gICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgIHZhciBwb3MgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7IC8vcG9zIHNob3VsZCBiZSBhdmFpbGFibGUgdG8gdXNlIGFzIHRoZSBzdGFydFxuICAgICAgdmFyIGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG4gICAgICAgIG1hcDogbWFwLFxuICAgICAgICBwb3NpdGlvbjogcG9zLFxuICAgICAgICBwaXhlbE9mZnNldDogbmV3IGdvb2dsZS5tYXBzLlNpemUoMCwgLTIwKSxcbiAgICAgICAgY29udGVudDogJ0ZvdW5kIHlvdSEgWW91IGFyZSBoZXJlLidcbiAgICAgIH0pO1xuICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICBwb3NpdGlvbjogcG9zLFxuICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCxcbiAgICAgICAgdGl0bGU6ICdZb3VyIGN1cnJlbnQgbG9jYXRpb24nXG4gICAgICB9KTtcbiAgICAgIC8vY29waWVkIHRoZSBuZXh0IHNpeCBsaW5lcyBmcm9tIGdvb2dsZVxuICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCB0b2dnbGVCb3VuY2UpO1xuXG4gICAgICBmdW5jdGlvbiB0b2dnbGVCb3VuY2UoKSB7XG4gICAgICAgIGlmIChtYXJrZXIuZ2V0QW5pbWF0aW9uKCkgIT09IG51bGwpIHtcbiAgICAgICAgICBtYXJrZXIuc2V0QW5pbWF0aW9uKG51bGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hcmtlci5zZXRBbmltYXRpb24oZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkJPVU5DRSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpbmZvd2luZG93Lm9wZW4obWFwLCBtYXJrZXIpOyAvL3RoaXMgc2hvdWxkIGJlIHJlZG9uZSBpbiB0aGUgaW5mb2JveCBjbGFzc1xuICAgICAgfSk7XG4gICAgICBtYXAuc2V0Q2VudGVyKHBvcyk7XG4gICAgICAvL3JlZmFjdG9yZWQgY29kZSBmcm9tIHdlYXRoZXIgYXBwXG4gICAgICB2YXIgYnRuV2hlcmVUbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidG5XaGVyZVRvJyk7IC8vY3JlYXRlcyB0aGUgYnV0dG9uIGVsZW1lbnQgdXNpbmcgdGhlIGlkIGZyb20gdGhlIGJ1dHRvbiBpbnB1dFxuICAgICAgYnRuV2hlcmVUby5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjYWxjUm91dGUoKTtcbiAgICAgIH07XG4gICAgICAvL2FkZHMgdGhlIGNhbGNyb3V0ZSB3aXRoaW4gZ2VvbG9jYXRpb24gYmVjYXVzZSBnZW9sb2NhdGlvbiBpcyB0aGUgc3RhcnRpbmcgcG9pbnRcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBoYW5kbGVOb0dlb2xvY2F0aW9uKHRydWUpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IEdlb2xvY2F0aW9uXG4gICAgaGFuZGxlTm9HZW9sb2NhdGlvbihmYWxzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlTm9HZW9sb2NhdGlvbihlcnJvckZsYWcpIHtcbiAgaWYgKGVycm9yRmxhZykge1xuICAgIHZhciBjb250ZW50ID0gJ0F3IHNuYXAhIFNvbWV0aGluZyB3ZW50IHdyb25nIHdpdGggdGhlIEdlb2xvY2F0aW9uIHNlcnZpY2UuIFNvcnJ5Pyc7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGNvbnRlbnQgPSAnQXcsIHNuYXAhIFlvdXIgYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBnZW9sb2NhdGlvbi4nO1xuICB9XG5cbiAgdmFyIG9wdGlvbnMgPSB7XG4gICAgbWFwOiBtYXAsXG4gICAgcG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoMzYuMTY2NywgODYuNzgzMyksXG4gICAgY29udGVudDogY29udGVudFxuICB9O1xuICB2YXIgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KG9wdGlvbnMpO1xuICBtYXAuc2V0Q2VudGVyKG9wdGlvbnMucG9zaXRpb24pO1xufVxuICAgIGNvbnNvbGUubG9nKHdoZXJlVG8gKyAnYmVmb3JlIGNhbGNSb3V0ZScpO1xuXG5mdW5jdGlvbiBjYWxjUm91dGUoKSB7XG4gIHZhciBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3aGVyZVRvJyk7IC8vdGFrZXMgdGhlIHVzZXIncyBpbnB1dFxudmFyIHdoZXJlVG8gPSBpbnB1dC52YWx1ZTsgLy90YWtlcyB0aGUgdmFsdWUgb2YgdGhlIHVzZXIgaW5wdXQgZm9yIHRoZSBkZXN0aW5hdGlvblxuICBkaXJlY3Rpb25zRGlzcGxheSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIoKTtcbiAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG1hcCk7XG4gIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgdmFyIHBvcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcbiAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgIG9yaWdpbjogcG9zLCAvL2Zyb20gZ2VvbG9jYXRpb25cbiAgICAgIGRlc3RpbmF0aW9uOiB3aGVyZVRvLCAvL2Zyb20gaW5wdXQudmFsdWUgb2YgI3doZXJlVG9cbiAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLlRyYXZlbE1vZGUuRFJJVklOR1xuICAgIH07XG4gICAgY29uc29sZS5sb2cocG9zKTtcbiAgICBjb25zb2xlLmxvZyh3aGVyZVRvKTtcbiAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZShyZXF1ZXN0LCBmdW5jdGlvbiAocmVzcG9uc2UsIHN0YXR1cykge1xuICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKSB7XG4gICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldERpcmVjdGlvbnMocmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn07XG5nb29nbGUubWFwcy5ldmVudC5hZGREb21MaXN0ZW5lcih3aW5kb3csICdsb2FkJywgaW5pdGlhbGl6ZSwgY2FsY1JvdXRlKTtcbiJdfQ==
