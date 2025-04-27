mapboxgl.accessToken = mapToken;
const mapDiv = document.getElementById("map");
const curLocation = JSON.parse(mapDiv.dataset.location);
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12",
  center: curLocation, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});
const marker2 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(curLocation)
  .addTo(map);

const popup = new mapboxgl.Popup({
  offset: 25,
}).setLngLat(curLocation).setHTML(`
    <h4>${loc}</h4>
    <p>approx 5-10 meters to the exact location</p>`);
marker2.setPopup(popup);

const layerList = document.getElementById("menu");
const inputs = layerList.getElementsByTagName("input");

for (const input of inputs) {
  input.onclick = (layer) => {
    const layerId = layer.target.id;
    map.setStyle("mapbox://styles/mapbox/" + layerId);
  };
}
