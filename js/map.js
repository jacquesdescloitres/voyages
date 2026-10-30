// Author: Jacques Descloitres (2025)

const initMapCenter = [ 45.640, 2.850 ];         // Auvergne (lat, lon)
const initZoom = 5;

const icon_bed = L.AwesomeMarkers.icon({
    icon: 'bed',
    prefix: 'fa',
    markerColor: 'red',
    iconColor: '#ffffff'
});
const icon_blue_pin = L.icon({iconUrl: "./icons/push-pin-icon-17895.png"});
console.log(icon_blue_pin);

const placemarks = [
    {
        label: "Saint-Sauves-d'Auvergne<br>19/09/2026-26/09/2026<br>VTF Domaine des Puys",        //  Saint-Sauves-d'Auvergne
        position: [ 45.623, 2.695 ],
        icon: icon_bed
    },
    {
        label: "Le Puy-en-Velay 22/09/2025<br>Ibis Budget",
        position: [ 45.04294, 3.89172 ],
        icon: icon_bed
    },
    {
        label: "Le Monastier-sur-Gazeille<br>23/09/2025<br>Gîte Le Rébémol",
        position: [ 44.93522, 3.99672 ],
        icon: icon_bed
    },
    {
        label: "Le Bouchet-Saint-Nicolas<br>24/09/2025<br>Gîte L'Arrestadou",
        position: [ 44.8913, 3.7953 ],
        icon: icon_bed
    },
    {
        label: "Pradelles 25/09/2025<br>Gîte de la Tournelle",
        position: [ 44.7687, 3.88315 ],
        icon: icon_bed
    },
    {
        label: "Cheylard-L'Èvêque 26/09/2025<br>Le Refuge du Moure",
        position: [ 44.6477, 3.8030 ],
        icon: icon_bed
    },
]

$(document).ready(function() {

        const instructions = $("#instructions").html();
        // Initialize the map
        const mapOptions = {
            zoomControl: false,
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: 'topleft',
                title: 'Activer Mode Plein Ecran',
                titleCancel: 'Désactiver Mode Plein Ecran'
            }
        }
        const map = L.map('map', mapOptions).setView(initMapCenter, initZoom);
        if (L.Control.Attribution.prototype._addTo) {       // compact attribution mode is available (dummy function L.Control.Attribution.prototype._addTo() defined in leaflet-responsive-attribution.js)
            // Make multiline attribution
            $(".leaflet-control-attribution").on('DOMSubtreeModified', function(){
                var regex = /\s*[|,]\s*/g;
                if ($(".leaflet-control-attribution").html().match(regex)) {
                    var newAttribution = $(".leaflet-control-attribution").html().replace(regex, "<br>");
                    $(".leaflet-control-attribution").html(newAttribution);
                }
            });
            // hide attribution when leaving button (rather than forcing clicking to toggle off)
            $(".leaflet-compact-attribution-label").on("mouseout", function () {
                $(".leaflet-compact-attribution-toggle").attr("checked", false);
            });
            // force using compact attribution mode (rather than default map-width-based mode)
            $(".leaflet-control-attribution").addClass("leaflet-compact-attribution");
            map.on('resize', function () {
                $(".leaflet-control-attribution").addClass("leaflet-compact-attribution");
            });
            // for future use
            map.attributionControl.options._responsive = true;
            map.attributionControl.options._maxWidth = 0;
            map.attributionControl.options._multiline = true;
        }
        map.attributionControl.setPrefix(instructions + '<br>Powered by <a href="https://leafletjs.com" target="_blank">Leaflet</a> &#128077;')  // redefine default leaflet credit

        // add zoom bar
        const zoomOptions = {
            position: "topleft",
        }
        if (L.Control.ZoomBar) {
            const zoomBar = new L.Control.ZoomBar(zoomOptions);
            zoomBar.addTo(map);
            zoomBar._zoomStartButton.title = 'Réinitialiser Zoom';
            zoomBar._zoomInButton.title = 'Zoom Avant';
            zoomBar._zoomOutButton.title = 'Zoom Arrière';
        }
        if (! mapOptions.zoomcontrol  ||  ! mapOptions.zoomcontrol.lasso)
            $(".leaflet-control-zoom-to-area").hide();

        // add placemarks
        Object.entries(placemarks).forEach(([idx, info], ) => {
            let position = info["position"];
            let icon = info["icon"];
            let label = info["label"];
            let marker = L.marker(position, {icon: icon});
            marker.addTo(map);
            marker.bindTooltip(label, {
                permanent: false,
                direction: "bottom",
                offset: [0,0]
            });
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    const coordOptions = {
        position: 'bottomleft',
        numDigits: 4,
        emptyString: null,
        lngFormatter: function(num) {
            var direction = (num < 0) ? 'W' : 'E';
            var formatted = 'Lon=' + Math.abs(num).toFixed(this.numDigits) + 'º ' + direction;
            return formatted;
        },
        latFormatter: function(num) {
            var direction = (num < 0) ? 'S' : 'N';
            var formatted = 'Lat=' + Math.abs(num).toFixed(this.numDigits) + 'º ' + direction;
            return formatted;
        }
    }

        L.control.mousePosition(coordOptions).addTo(map);

        // Basemaps
        const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 21,
            maxNativeZoom: 19
        });
        const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: "Esri, Maxar, Earthstar Geographics",
            maxZoom: 21,
            maxNativeZoom: 19
        });
        const hot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team'
        });


        const baseMaps = {
            "Carte": osm,
            "Satellite": satellite,
        };
        const overlays = {
        };

        // Add the default basemap
        osm.addTo(map);

        // Add the layer control to the map
        const layerControl = L.control.layers(baseMaps, overlays).addTo(map);


const gpxTracks = [];
fetch('./gps/tracks.txt')
  .then(response => response.text())
  .then((tracklist) => {
    tracklist.trim().split("\n").forEach((line) => {
        if (! line.trim().startsWith('#')) {
            const file = line.trim();
            const path = "./gps/" + file;
            const date = file.split("_")[0];
            const entry = {name: date, file: path, color: "red"};
            gpxTracks.push(entry);
        }
    });
    console.log(gpxTracks);



        // Load all GPX tracks
        gpxTracks.forEach(track => {
            var gpx = new L.GPX(track.file, {
                async: true,
                polyline_options: {
                    color: track.color,
                    weight: 3,
                    opacity: 0.7
                },
/*
                marker_options: {
                    iconSize: [40, 40],
                    iconAnchor: [12, 35],
                },
*/
                markers: {
//                  startIcon: "./icons/push-pin-icon-17895.png",
                    startIcon: null,
//                  startIcon: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${track.color}.png`,
                    endIcon: null,
//                  endIconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${track.color}.png`,
//                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    wptTypeIcons: {
                        '': L.Icon.Default,
                        'xlodging': "dummy"
                    }
                },
                gpx_options: {
                    parseElements: ['track', 'waypoint']
                }
            }).on('loaded', function(e) {
                //this.bindTooltip(e.target.get_name(), {permanent: false, direction: "bottomright", offset: [0,0]});
                const layerGroup = e.target.getLayers()[0];     // L.LayerGroup object with layers associated with GPX track
                // add hovering to track
                const polyline = layerGroup.getLayers()[0];     // 1st layer is the track (L.Polyline instance)
                polyline.on('mouseover', () => polyline.setStyle({ weight: 6 }));
                polyline.on('mouseout', () => polyline.setStyle({ weight: 3 }));
                // assign custom css class to each type of marker icon to handle size and more
                // (marker_options of L.GPX() only handles one unique size/anchor for all markers)
                const startMarker = layerGroup.getLayers()[1];
                startMarker.bindTooltip(e.target.get_name(), {permanent: false, direction: "bottomright", offset: [0,0]});
                $(startMarker._icon).addClass('leaflet-gpx-start-icon');
                layerGroup.eachLayer(function(layer) {
                    if (layer.options.type == "waypoint") {
if (layer.options.title == "Gîte de la Tournelle") {
//if (layer.options.icon == "dummy") {
console.log(layer.options.icon instanceof L.Icon);
//layer.options.icon = icon_blue_pin;
console.log(layer);
console.log(this);
console.log(e.target);
const marker = layer;
const placemark = {
    label: "",
    position: marker.latlng,
    icon: icon_bed
}
}
                        $(layer._icon).addClass('leaflet-gpx-waypoint-icon');
                        layer.bindTooltip(layer.options.title, {permanent: false, direction: "bottomright", offset: [0,0]});
                    }
                });

            });
            gpx.addTo(map);
        });


  });

    // Add a refresh button
    L.easyButton('<i class="fa fa-refresh"></i>', function(btn, map) {
        map.eachLayer(function(layer) {
            if (layer instanceof L.GPX)
                layer.reload();     // reload GPX track from source
        })
    }, {
        position: 'topleft',
        id: 'refreshButton',
        title: 'Refresh'
    }).addTo(map);

});
