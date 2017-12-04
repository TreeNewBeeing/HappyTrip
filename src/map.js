var key = "AIzaSyBuzRjopdHSem5nmpae2VQsATTCycwAh8o"


// binding
var pre
var prenumber
var current_place_id


// local storagr
if(localStorage.getItem('places')==null){
	localStorage.setItem('places', '');
}
var places = localStorage.getItem('places')




function search(address){
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+key
	$.get(url,function(a){
		console.log(a)
	})
}

function savePlace(){

	if(current_place_id == null){
		$(".info").text("Error: Please choose one place otherwise please submit.")
		return
	}
	places+=current_place_id+" ";
	localStorage.setItem('places',places);
	window.location.href = 'index.html'
}



// init function 
function initAutocomplete() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -33.8688, lng: 151.2195},
		zoom: 13,
		mapTypeId: 'roadmap'
	});
	

	// infoWindow = new google.maps.InfoWindow;

	// if (navigator.geolocation) {
 //          	navigator.geolocation.getCurrentPosition(function(position) {
	//             var pos = {
	//             	lat: position.coords.latitude,
	//               	lng: position.coords.longitude
	//             };

	//             infoWindow.setPosition(pos);
	//             infoWindow.setContent('Location found.');
	//             infoWindow.open(map);
	//             map.setCenter(pos);
 //        	}, function() {
 //            	handleLocationError(true, infoWindow, map.getCenter());
 //          	});
 //    } else {
 //          // Browser doesn't support Geolocation
 //          	handleLocationError(false, infoWindow, map.getCenter());
 //    }
    

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
    	searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.

    searchBox.addListener('places_changed', function() {

    	// clear out the old cards
    	clearAllResult()

    	var places1 = searchBox.getPlaces();

    	if (places1.length == 0) {
    		return;
    	}

      	// Clear out the old markers.
	    markers.forEach(function(marker) {
			marker.setMap(null);
	      });
		markers = [];

      	// For each place, get the icon, name and location.
      	var i=0;
		var bounds = new google.maps.LatLngBounds();
  		places1.forEach(function(place) {
  			prenumber = null
      		if (!place.geometry) {
      			console.log("Returned place contains no geometry");
      			return;
      		}
	      	var icon = {
	      		url: place.icon,
	      		size: new google.maps.Size(71, 71),
	      		origin: new google.maps.Point(0, 0),
	      		anchor: new google.maps.Point(17, 34),
	      		scaledSize: new google.maps.Size(25, 25)
	      	};

	      	var newMarker = new google.maps.Marker({
	      		map: map,
				//icon: icon,
				title: place.name,
				animation: google.maps.Animation.DROP,
				position: place.geometry.location,
				place_id: place.place_id
	  		})

	        // add click event
	        newMarker.addListener('click',function(){
	        	
	        	if(prenumber != null){
	        		markers[prenumber].setAnimation(null)
	        		$(".result_places .card[number="+prenumber+"]").removeClass("choosen_card")
	        		console.log(pre)
	        	}
	        	var curnumber
	        	for(var i=0;i<markers.length;i++){
	        		if(markers[i] == this){
	        			curnumber = i
	        		}
	        	}
	        	console.log("in marker curnumber: "+curnumber)
	        	console.log("in marker prenumber: "+prenumber)
	        	if(curnumber != prenumber){
	        		this.setAnimation(google.maps.Animation.BOUNCE);
	        		current_place_id = this.place_id
	        	
	        		$(".result_places .card[number="+curnumber+"]").addClass("choosen_card")
	        		prenumber = curnumber
	        	}else{
	        		this.setAnimation(null);
	        		current_place_id = null
	        		$(".result_places .card[number="+curnumber+"]").removeClass("choosen_card")
	        		prenumber = null
	        	}

	        })

	        // Create a marker for each place.
	        markers.push(newMarker);

	        if (place.geometry.viewport) {
	          // Only geocodes have viewport.
	      		bounds.union(place.geometry.viewport);
	  		} else {
	      		bounds.extend(place.geometry.location);
	      	}

	      	// add card 
	      	place.number = i;
	      	i++
	        outputPlace(place,".result_places")
  		});
		
		// bind click
		$(".result_places .card").click(function(){
			if(prenumber!=null){
				$(".result_places .card[number="+prenumber+"]").removeClass("choosen_card")
				markers[prenumber].setAnimation(null)
			}
			console.log($(this).attr("number"))
			var curnumber = $(this).attr("number")
			if(curnumber != prenumber){
				$(this).addClass("choosen_card")
				markers[curnumber].setAnimation(google.maps.Animation.BOUNCE)
				prenumber = curnumber
				current_place_id = markers[curnumber].place_id
			}else{
				current_place_id = null
				markers[curnumber].setAnimation(null)
				prenumber = null
			}
		})
		
		
		map.fitBounds(bounds);
		console.log(markers)
	});

	var service = new google.maps.places.PlacesService(map);
	outputSavedPlaces(places,service)
}