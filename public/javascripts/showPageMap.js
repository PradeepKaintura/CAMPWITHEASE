const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`, // stylesheet location
    center: campground.geometry.coordinates   , // starting position [lng, lat]
    zoom: 10 // starting zoom
    });

new maplibregl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new maplibregl.Popup({offset:25}).setHTML(
        `<h5>${campground.title}</h5>`
    ))
    .addTo(map);

    map.addControl(new maplibregl.NavigationControl());

    map.addControl(
        new maplibregl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        trackUserLocation: true
        })
        );
    
    map.addControl(new maplibregl.FullscreenControl());

const scale = new maplibregl.ScaleControl({
        maxWidth: 80,
        unit: 'imperial'
    });
    map.addControl(scale);
    
    scale.setUnit('metric');