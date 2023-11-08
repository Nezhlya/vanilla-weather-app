let apiKey = "b5e7d88b0d219a3822897ddaeda253c9";
let units = "metric";

let dateElement = document.querySelector("#timeDate");
let date = moment().format("dddd H:mm");
dateElement.innerHTML = date;

let forecast = document.querySelector("#forecast");
function showWeekdays(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days[day];
}
function showForecast(response) {
  console.log(response);
  let forecastDaily = response.data.daily;
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
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showForecast);
}
function enterCity(city) {
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}
function enterInput(event) {
  event.preventDefault();
  let city = document.querySelector("input.city").value;
  let nameCity = document.querySelector("#userCity");
  nameCity.innerHTML = city.charAt(0).toUpperCase() + city.slice(1);

  enterCity(city);
}

let form = document.querySelector("#searchCity");
form.addEventListener("submit", enterInput);

function showWeather(response) {
  console.log(response);
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

  //map

  maptilersdk.config.apiKey = "uWIkkOudLeqGl9dH8rgx";
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
function toCelsius(event) {
  event.preventDefault();
  document.querySelector("#units").innerHTML = "m/s";
  units = "metric";
}

function toFahrenheit(event) {
  event.preventDefault();
  document.querySelector("#units").innerHTML = "mph";
  units = "imperial";
}


let celsiusTof = document.querySelector("#fahrenheit");
celsiusTof.addEventListener("click", toFahrenheit);

let fahrenheiToc = document.querySelector("#celsius");
fahrenheiToc.addEventListener("click", toCelsius);
