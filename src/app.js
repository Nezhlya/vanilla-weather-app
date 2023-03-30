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
  return enterCity;
}

let form = document.querySelector("#searchCity");
form.addEventListener("submit", enterCity);

function showWeather(response) {
  let temp = document.querySelector("#temp");
  let celsius = response.data.main.temp;
  temp.innerHTML = Math.round(celsius);

  let celsiusTof = document.querySelector("#fahrenheit");
  celsiusTof.addEventListener("click", toFahrenheit);

  let fahrenheiToc = document.querySelector("#celsius");
  fahrenheiToc.addEventListener("click", enterCity);

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `<b>Humidity</b> ${response.data.main.humidity}%`;

  let wind = document.querySelector("#wind");
  wind.innerHTML = `<b>Wind speed</b> ${Math.round(
    response.data.wind.speed
  )}km/h`;

  let weatherIcon = document.querySelector("#icon");
  let iconCode = response.data.weather[0].icon;
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconCode}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);

  $("span.units").show();

  maptilersdk.config.apiKey = "IIPQdRIn38a0j41VBD8g";
  var map = new maptilersdk.Map({
    container: "map",
    style: maptilersdk.MapStyle.CITIES,
    center: [response.data.coord.lon, response.data.coord.lat],
    zoom: 10,
  });
  let marker = new maptilersdk.Marker()
    .setLngLat([response.data.coord.lon, response.data.coord.lat])
    .addTo(map);

  document.getElementById("src").addEventListener("click", function () {
    map.flyTo({
      center: [response.data.coord.lon, response.data.coord.lat],
      essential: true,
    });
  });
}
function toFahrenheit() {
  let apiKey = "fda3688b1db05987dd5d07c237aecfba";
  let city = document.querySelector("input.city").value;
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  let nameCity = document.querySelector("li#userCity");
  nameCity.innerHTML = city.charAt(0).toUpperCase() + city.slice(1);
  axios.get(apiUrl).then(showWeather);
}
