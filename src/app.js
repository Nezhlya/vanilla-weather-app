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

function enterCity(event) {
  event.preventDefault();
  let apiKey = "fda3688b1db05987dd5d07c237aecfba";
  let city = document.querySelector("input.city").value;
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  let nameCity = document.querySelector("li#userCity");
  nameCity.innerHTML = city.charAt(0).toUpperCase() + city.slice(1);
  axios.get(apiUrl).then(showWeather);
}

let form = document.querySelector("#searchCity");
form.addEventListener("submit", enterCity);

function showWeather(response) {
  console.log(response);
  let temp = document.querySelector("#temp");
  let celsius = response.data.main.temp;
  temp.innerHTML = Math.round(celsius);

  let celsiusTof = document.querySelector("#fahrenheit");
  celsiusTof.addEventListener("click", toFahrenheit);

  let fahrenheiToc = document.querySelector("#celsius");
  fahrenheiToc.addEventListener("click", enterCity);

  let weatherIcon = document.querySelector("#icon");
  let iconCode = response.data.weather[0].icon;
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconCode}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);

  $("span.units").show();

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
      center: ol.proj.fromLonLat([
        response.data.coord.lon,
        response.data.coord.lat,
      ]),
      zoom: 10,
    }),
  });
  let marker = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [
        new ol.Feature({
          geometry: new ol.geom.Point(
            ol.proj.fromLonLat([
              response.data.coord.lon,
              response.data.coord.lat,
            ])
          ),

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
}
function toFahrenheit(event) {
  event.preventDefault();
  let apiKey = "fda3688b1db05987dd5d07c237aecfba";
  let city = document.querySelector("input.city").value;
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  let nameCity = document.querySelector("li#userCity");
  nameCity.innerHTML = city.charAt(0).toUpperCase() + city.slice(1);
  axios.get(apiUrl).then(showWeather);
}
