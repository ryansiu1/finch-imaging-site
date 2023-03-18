//Add default public map token from your Mapbox account
mapboxgl.accessToken = 'pk.eyJ1IjoicnlhbnNpdSIsImEiOiJjbGRtMHJneGgwNHRxM3B0Ym5tb251bDg3In0.gJy3-nzKDytiGCJoqi1Y6w';

// //define maximum and minimum scroll bounds for the maps
// const maxBounds = [
//     [-99, 52], //SW coords
//     [-96, 48] //NE coords
// ];

//Initializing the map
const map = new mapboxgl.Map({
    container: 'map', // Add div container ID for your map
    style: 'mapbox://styles/mapbox/dark-v11', // Add link to style URL, I used a default styling offered by Mapbox
    projection: 'globe', // Displays the web map as a globe, instead of the default Web Mercator
    center: [-97.365, 50.025], // starting position [longitude, latitude]
    zoom: 10.5, // starting zoom
    bearing: 0,
    minZoom: 8,
    maxZoom: 13,
    // maxBounds: maxBounds
});

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style, this adds the 'foggy' like feature when fully zoomed out
});

//Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

//Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());



map.on('load', () => {
    //Adding the original boundaries layer
    map.addSource('original-boundaries', {
        type: 'geojson',
        // Use a URL from Lab 1.
        data: 'https://raw.githubusercontent.com/ryansiu1/datarepo/main/boundaries.geojson'
    });

    map.addLayer({
        'id': 'original-boundaries-layer',
        'type': 'fill',
        'source': 'original-boundaries',
        'paint': {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.5
        }
    });

    map.setLayoutProperty(
        'original-boundaries-layer',
        'visibility',
        'none'
    );

    //Adding the proposed imaging site layer
    map.addSource('proposed-boundaries', {
        type: 'geojson',
        // Use a URL from Lab 1.
        data: 'https://raw.githubusercontent.com/ryansiu1/datarepo/main/proposed.geojson'
    });

    map.addLayer({
        'id': 'proposed-boundaries-layer',
        'type': 'fill',
        'source': 'proposed-boundaries',
        'paint': {
            'fill-color': '#ffffff', // blue color fill
            'fill-opacity': 0.5
        }
    });

    map.addLayer({
        'id': 'proposed-boundaries-layer-fill',
        'type': 'fill',
        'source': 'proposed-boundaries',
        'paint': {
            'fill-color': '#ffffff', // blue color fill
            'fill-opacity': 1,
            'fill-outline-color': 'black'
        },
        'filter': ['==', ['get', 'OBJECTID'], ''] // This filter will disable the layer from appearing until it is hovered over
    });


    // Add a hover effect for the proposed plot when the mouse is over it
    map.on('mousemove', 'proposed-boundaries-layer', (e) => {
        if (e.features.length > 0) { //determines if there is a feature under the mouse
            map.setFilter('proposed-boundaries-layer-fill', ['==', ['get', 'OBJECTID'], e.features[0].properties.OBJECTID]); //applies the filter set above
        }
    });

    map.on('mouseleave', 'proposed-boundaries-layer-fill', () => { //removes the highlight when the mouse moves away
        map.setFilter("proposed-boundaries-layer-fill", ['==', ['get', 'OBJECTID'], '']);
    });

    // asfksdjfsd
    map.on("mousemove", function (e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ["proposed-boundaries-layer"]
        });

        if (features.length) {
            //show median income in textbox
            document.getElementById('indicator').innerHTML = "The area of this plot in square kilometers is: " + features[0].properties.area;

        } else {
            //if not hovering over a feature set indicator to default message
            document.getElementById('indicator').innerHTML = "Hover your cursor over a plot to get its area!";
        }
    });


    // Original layer display (check box)
    document.getElementById('originalCheck').addEventListener('change', (e) => {
        map.setLayoutProperty(
            'original-boundaries-layer',
            'visibility',
            e.target.checked ? 'visible' : 'none'
        );
    });

    // Proposed  layer display (check box)
    document.getElementById('proposedCheck').addEventListener('change', (e) => {
        map.setLayoutProperty(
            'proposed-boundaries-layer',
            'visibility',
            e.target.checked ? 'visible' : 'none'
        );
    });
    //Create popups upon a click 
    map.on('click', 'proposed-boundaries-layer', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("Field Name: " + e.features[0].properties.FIELD_NAME) //indexes the GeoJSON code
            .addTo(map);
    });

    // Changes the cursor to a link pointer when the mouse is over a plot
    map.on('mouseenter', 'proposed-boundaries-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Changes the cursor back to a pointer when it leaves a plot
    map.on('mouseleave', 'proposed-boundaries-layer', () => {
        map.getCanvas().style.cursor = '';
    });

    

});