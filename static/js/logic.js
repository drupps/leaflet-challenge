//storing the api in an variable
var queryURL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryURL, function (data) {
  console.log(data);
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function addTooltip(feature, mapObject) {
    mapObject.bindPopup(
      "<h3>" +
        feature.properties.place +
        "</h3><hr><p>" +
        new Date(feature.properties.time) +
        "</p>"
    );
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: addTooltip,
    pointToLayer: style

  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function style(feature, latlng) {
  return new L.circle(latlng, {
    opacity: .8,
    fillOpacity: 1,
    fillColor: chooseColor(feature.geometry.coordinates[2]),
    color:  "#0000000",
    radius: markerSize(feature.properties.mag),
    stroke: true,
    weight: 0.5

  });
}

function markerSize(mag) {
        if(mag === 0){ 
            return 1;
        }   
        return mag * 10000
      }

function chooseColor(depth){
// Conditionals for countries points
  switch(true){
    case depth > 89:
      return "#E50B0B";
    case depth > 69:
      return "#FFB533";
    case depth > 49:
      return "#FFC133";
    case depth > 29:
      return " #FFDA33";
    case depth > 9:
      return "#CAFF33";
    case depth > -9:
      return "#9FFF33";
  }
}

function createMap(earthquakes) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY,
    }
  );
  // var darkmap = L.tileLayer(
  //   "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  //   {
  //     attribution:
  //       'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //     maxZoom: 18,
  //     id: "dark-v10",
  //     accessToken: API_KEY,
  //   }
  // );

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [streetmap, earthquakes],
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);
}

// Loop through the cities array and create one marker for each city object
// for (var i = 0; i < earthquakeData.length; i++) {

//   // Add circles to map
//   L.circle(countries[i].location, {
//     fillOpacity: 0.75,
//     color: "white",
//     fillColor: color,
//     // Adjust radius
//     radius: countries[i].points * 1500
//   }).bindPopup("<h1>" + countries[i].name + "</h1> <hr> <h3>Points: " + countries[i].points + "</h3>").addTo(myMap);
// }