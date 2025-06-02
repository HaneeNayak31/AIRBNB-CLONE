const center = JSON.parse(coordinates); // [lng, lat]
console.log("center:", center);

maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: center,
  zoom: 14,
});

// ✅ Add marker
new maptilersdk.Marker({ color: "red" })
  .setLngLat(center)
  .setPopup(
    new maptilersdk.Popup().setHTML(
      `<h4><p>Exact location provided after booking!</p></h4>`
    )
  )
  .addTo(map);
console.log(marker.getPopup());

// ✅ Add geocoding only if available
if (typeof maptilerGeocoding !== "undefined") {
  const gc = new maptilerGeocoding.GeocodingControl({
    apiKey: mapToken,
    maptilersdk,
  });
  map.addControl(gc);
} else {
  console.warn("maptilerGeocoding not loaded");
}
