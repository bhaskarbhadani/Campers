
mapboxgl.accessToken =mapToken ;
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: campground.geometry.coordinates,
zoom: 9 
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
   .setLngLat(campground.geometry.coordinates)
   .setPopup(
       new mapboxgl.Popup({offset: 25})
       .setHTML(
        `<h4>${campground.title}</h4> <p>${campground.location}</p>`
       )
   )
   .addTo(map);