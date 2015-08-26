/*global google Tabletop*/
/*eslint-env browser */

/**
 * Returns a string of information about a given sports team 
 * @param {Object} data The sports team object
 * @return {String} An information string about the sports team
 */
function buildContent( data ){

	var twitterLogo = "	https://abs.twimg.com/a/1382598364/images/resources/twitter-bird-blue-on-white.png";
	var contentString = '<table class="table table-bordered">' +
							'<tbody>' +
								'<tr>' + 
									'<th>Historic Site</th>' + 
									'<td><a href="' + data.website + '"</a>' + data.site + '</td>' +
									'<td align="center"><a href="https://twitter.com/' + data.twitter + '"</a><img src=' + twitterLogo + ' alt="Twitter" height="20" width="20"</td>' + 
								'</tr>' +
							'</tbody>' +
						'<table>';
	
	return contentString;
}


/**
 * Plots information about a single team on a map
 * @param {Object} team A single team from the Bundesliga database
 */
function plot(team){
	var position = new google.maps.LatLng ( team.latitude, team.longitude );
	
	var marker = new google.maps.Marker({
		position: position,
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			fillOpacity: 0.7,
			fillColor: "#a31720",
			strokeOpacity: 0.9,
			strokeColor: "#a31720",
			strokeWeight: 2,
			scale: 10   //pixels
		},
		title: team.team,
		map: this.map
	});
	

	var that = this;
	google.maps.event.addListener(marker, 'click', function() {
		that.popup.setContent( buildContent(team) );
		that.popup.open(that.map, marker);
	});
}

/**
 * Creates a map and plots data from the provided spreadsheet on the map.
 * @param {Object} data The spreadsheet data object from tabletop.
 */
function showInfo(data) {
	
	var styles = [
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "administrative.locality",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "administrative.neighborhood",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "poi",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "road",
    "stylers": [
      { "saturation": -67 },
      { "weight": 0.7 },
      { "lightness": 15 }
    ]
  },{
    "featureType": "water",
    "stylers": [
      { "lightness": -24 }
    ]
  },{
  }
];

    var mapOptions = {
		mapTypeControlOptions: { mapTypeIds: [ 'Styled'] },
		center: new google.maps.LatLng( 45.42153, -75.69 ),//start in ottawa
		zoom: 7,
		mapTypeId: 'Styled'
	};

	//create and style the map
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);	
	var styledMapType = new google.maps.StyledMapType( styles, { name: 'National Historic Sites' } );
    map.mapTypes.set('Styled', styledMapType);  
    
    //create popup window that will be used when clicking markers
    var popup = new google.maps.InfoWindow();
    
    //plot each team on the map
    var that = {map: map, popup: popup};
    data.sites.elements.forEach(plot, that);
}

window.onload = function() {
    var spreadsheet = '1icgNyHLS6kuVONHgL473dgo4l-Dc4k7DqZnO564dnBw';
    
    //uncomment sheet below for Canadian version
    //var spreadsheet = 'https://docs.google.com/spreadsheet/ccc?key=0AnDA54eMM-5ydEJVaGNhaXR3d2RDblJ6ZEdfU3A0UXc&usp=sharing&output=html';
    //uncomment sheet below for German version
    //var spreadsheet = 'https://docs.google.com/spreadsheet/ccc?key=0AhLgoEUzhCg_dEFKOS1kUG5iNDJrc2dSVGg0dWZBekE&usp=sharing&output=html';
    
    Tabletop.init({ key: spreadsheet, callback: showInfo});
};