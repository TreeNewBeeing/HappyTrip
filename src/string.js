
function outputSavedPlaces(places,service){
	var p = places.split(' ')
	console.log(p)
	for(var i=0; i<p.length-1; i++){
		if(p[i] == "")
			continue
		service.getDetails({
          placeId: p[i]
        }, function(place, status) {

          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // var marker = new google.maps.Marker({
            //   map: map,
            //   position: place.geometry.location
            // });
            // google.maps.event.addListener(marker, 'click', function() {
            //   infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            //     'Place ID: ' + place.place_id + '<br>' +
            //     place.formatted_address + '</div>');
            //   infowindow.open(map, this);
            // });
			outputPlace(place,".saved_places")
          }
        });

	}
	//$(".saved_places").append(str)
}

function outputPlace(place,where){
	$(where).append(card(place))
}
function card(place){
	str = '<div class="card" id="'+place.place_id+'" number="'+place.number+'"><h5>'
		+ place.name + '</h5><hr>'
	//for(var i=0; i<place.types.length; i++){
		str += place.types[0].replace(/\_/g," ")
	//}
	str	+= '</div>'	
	console.log(place.opening_hours)	
	return str;
}

function clearAllResult(){
	$(".result_places").html("")
}

function clearAllSaved(){
	if(confirm("Do u really want to remove all items? ")){
		$(".saved_places").html("")
		places = ""
		localStorage.setItem("places",places)
	}

}

function remove(){
	console.log("A")
	if($(".saved_places .card").hasClass("remove")){
		$(".saved_places .card").removeClass("remove")
	}else{
		$(".saved_places .card").addClass("remove")
	
		$(".saved_places .card").click(function(){
			if(confirm("Do u really want to remove the place: "+$("h5",this).html())){
				places = places.replace($(this).attr("id"),"")
				localStorage.setItem('places',places)
				$(this).remove();
				
			}
			$(".saved_places .card").removeClass("remove")
			$(".saved_places .card").unbind( "click" );
		})

	}

}