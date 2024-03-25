// Define the map and set its initial view to a global scale
var map = L.map('map').setView([10, 90], 4);

// Add a tile layer to the map (background map image)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
  return magnitude * 4; // Adjust as necessary
}

// Function to choose color based on earthquake depth
function depthColor(depth) {
  if (depth > 90) return '#EA2B1F';
  else if (depth > 70) return '#EA822C';
  else if (depth > 50) return '#EE9C00';
  else if (depth > 30) return '#EECC00';
  else if (depth > 10) return '#D4EE00';
  else return '#98EE00';
}

var geojsonUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(geojsonUrl).then(function(data) {
    L.geoJSON(data, {
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag +
            "<br>Location: " + feature.properties.place +
            "<br>Depth: " + feature.geometry.coordinates[2] + " km");
        },
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: depthColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    }).addTo(map);
});

// Initialize the legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our depth intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + depthColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;
};

// Add the legend to the map
legend.addTo(map);
