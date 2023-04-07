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

let p = document.querySelector("#timeDate");
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
function showWeekdays(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days[day];
}

function showForecast(response) {
  console.log(response);
  let forecastDaily = response.data.daily;
  let forecast = document.querySelector("#forecast");
  let forecastHTML = ` <div class="row row-cols-3" id="head">`;
  forecastDaily.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` <div class="col">${showWeekdays(forecastDay.dt)}</div>
    <div class="col"> <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        /></div>
  <div class="col"><span id="high">${Math.round(
    forecastDay.temp.max
  )}°  </span><span id="low">${Math.round(forecastDay.temp.min)}°</span></div>
    `;
    }
  });
  forecast.innerHTML = forecastHTML;
  forecastHTML = forecastHTML + `</div>`;
}

function getForecast(coordinates) {
  let apiKey = "fda3688b1db05987dd5d07c237aecfba";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}
function enterCity(event) {
  event.preventDefault();
  let apiKey = "fda3688b1db05987dd5d07c237aecfba";
  let city = document.querySelector("input.city").value;
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  let nameCity = document.querySelector("#userCity");
  nameCity.innerHTML = city.charAt(0).toUpperCase() + city.slice(1);
  axios.get(apiUrl).then(showWeather);
}

let form = document.querySelector("#searchCity");
form.addEventListener("submit", enterCity);

function showWeather(response) {
  let card = document.querySelector("div.container").style;
  card.position = "absolute";
  card.display = "grid";
  card.justifyItems = "center";
  card.justifyContent = "space-evenly";
  card.gridTemplateAreas = `"header header header header"
    "main1 . . main2"`;
  let header = document.querySelector("#header").style;
  header.gridArea = "header";

  let main = document.querySelector("#today").style;
  main.gridArea = "main1";

  let forecast = document.querySelector("#forecast").style;
  forecast.gridArea = "main2";

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
  wind.innerHTML = `<b>Wind speed</b> ${Math.round(response.data.wind.speed)}`;

  let descr = document.querySelector("#description");
  descr.innerHTML = response.data.weather[0].description;

  let weatherIcon = document.querySelector("#icon");
  let iconCode = response.data.weather[0].icon;
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconCode}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].main);

  $("span.units").show();
  $("#units").show();

  maptilersdk.config.apiKey = "IIPQdRIn38a0j41VBD8g";
  var map = new maptilersdk.Map({
    container: "map",
    style: maptilersdk.MapStyle.CITIES,
    center: [response.data.coord.lon, response.data.coord.lat],
    zoom: 7,
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
  getForecast(response.data.coord);
}
function toFahrenheit() {
  let apiKey = "fda3688b1db05987dd5d07c237aecfba";
  let city = document.querySelector("input.city").value;
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  let nameCity = document.querySelector("#userCity");
  nameCity.innerHTML = city.charAt(0).toUpperCase() + city.slice(1);
  document.querySelector("#units").innerHTML = "mi/h";
  axios.get(apiUrl).then(showWeather);
}
