// worked with TA Erin Wills and other classmates

  // Define a function 
  function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

 // Define streetmap and darkmap layers, these are coming from mapbox
 var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });


  // Define a baseMaps object to hold our base layers, we creating a key
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satelite Map": satellitemap
  };
  
//  set up default map
var myMap = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 5,
    layers: [streetmap]     //default selected layer
    });


//  add street map to myMap
streetmap.addTo(myMap);


// 
var earthquakes = new L.LayerGroup();
// Alternate method and same as above
// var earthquakes = L.layerGroup();
var faultlines = new L.LayerGroup();
// Create overlay object to hold our overlay layer

var overlayMaps = {
  Earthquakes: earthquakes,
  "Fault lines ": faultlines
};

// Create a layer control
// Pass in our baseMaps and overlayMaps
L.control.layers(baseMaps, overlayMaps, {
  
}).addTo(myMap);

// bring data here
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function

  // Create a GeoJSON layer containing the features array on the earthquakeData object, then make markers circles, size them and change color
  L.geoJSON(data, {
    onEachFeature: popUpMsg,
    pointToLayer: function(feature, latlng) {  
      return new L.CircleMarker(latlng, {
        radius: feature.properties.mag * 10, 
        color: depthColor (feature.geometry.coordinates[2]),
        fillOpacity: 0.85
      });
    }


  }).addTo(earthquakes);


  earthquakes.addTo(myMap);
});


// Add faultlines
url = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'
d3.json(url, function(data){
  // Once we get a response, send the data.features object to the createFeatures function

  // Create a GeoJSON layer containing the features array on the earthquakeData object, then make markers circles, size them and change color
  L.geoJSON(data,{
    style: function(){
      return {
        color: "red",
        weight: "1.5",
        opacity: 0.8
      };
  }}
  ).addTo(faultlines);
    

  faultlines.addTo(myMap);
});



// 

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5, 10],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += '<h3>Legend</h3>'
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + depthColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap)


// changes color based on depth
function depthColor(depth){
    if (depth > 10) {
      color = "red";
    }
    else if (depth > 5 ){
      color = "yellow";
    }

    else {
      color = "green"
    }

  return color;
}


