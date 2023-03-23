let currentDate = new Date();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let p = document.querySelector("p#timeDate");
let day = days[currentDate.getDay()];
let hour = currentDate.getHours();
if (hour < 10) {
  hour = "0" + hour;
}
let minutes = currentDate.getMinutes();
if (minutes < 10) {
  minutes = "0" + minutes;
}

p.innerHTML = `${day}, ${hour}:${minutes}`;

let map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.TileJSON({
        url: `https://api.maptiler.com/maps/basic-v2/tiles.json?key=IIPQdRIn38a0j41VBD8g`,
        tileSize: 512,
      }),
    }),
  ],
  target: `map`,
  view: new ol.View({
    center: ol.proj.fromLonLat([5.9056, 51.9517]),
    zoom: 10,
  }),
});
let marker = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [
      new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([5.9056, 51.9517])),
        anchor: new ol.geom.Point(0, 32),
      }),
    ],
  }),
  style: new ol.style.Style({
    image: new ol.style.Icon({
      src: "https://docs.maptiler.com/openlayers/default-marker/marker-icon.png",
    }),
  }),
});
map.addLayer(marker);
