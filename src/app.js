
const apiKey = "b5e7d88b0d219a3822897ddaeda253c9";
let units = "metric";

const dateElement = document.querySelector("#timeDate");
const forecastElement = document.querySelector("#forecast");

const showWeekdays = timestamp => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][new Date(timestamp * 1000).getDay()];

const showForecast = response => {
  console.log(response)
  const forecastDaily = Object.entries(response.data); 
  if (!Array.isArray(forecastDaily)) {
    console.error("Invalid forecast data");
    return;}
  const forecastHTML = forecastDaily.map(forecastDay => `
    <div class="col">${showWeekdays(forecastDay.dt)}</div>
    <div class="col">
      <img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" alt="" width="42" />
    </div>
    <div class="col">
      <span id="high">${Math.round(forecastDay.temp_max)}°</span>
      <span id="low">${Math.round(forecastDay.temp_min)}°</span>
    </div>
  `).join("");
  forecastElement.innerHTML = `<div class="row row-cols-3" id="head">${forecastHTML}</div>`;
};

const getWeatherData = city => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl)
    .then(response => {
      showWeather(response);
      showForecast(response); 
    })
};

const enterCity = event => {
  event.preventDefault();
  const city = document.querySelector("input.city").value;
  document.querySelector("#userCity").innerHTML = city.charAt(0).toUpperCase() + city.slice(1);
  getWeatherData(city);
};

const showWeather = response => {
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
  
   showForecast(response)
  $("span.units").show();
  $("#units").show();
};

const changeUnits = (event, newUnits) => {
  event.preventDefault();
  units = newUnits;
  const city = document.querySelector("input.city").value;
  getWeatherData(city);
};

document.querySelector("#searchCity").addEventListener("submit", enterCity);
document.querySelector("#celsius").addEventListener("click", event => changeUnits(event, "metric"));
document.querySelector("#fahrenheit").addEventListener("click", event => changeUnits(event, "imperial"));



