
const apiKey = "b5e7d88b0d219a3822897ddaeda253c9";
let units = "metric";

const dateElement = document.querySelector("#timeDate");
const forecastElement = document.querySelector("#forecast");

const showWeekdays = timestamp => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(timestamp * 1000).getDay()];

const showForecast = response => {
  console.log(response);
  let forecastDaily = response.data.list;
  const uniqueDays = [...new Set(forecastDaily.map(forecastDay => new Date(forecastDay.dt * 1000).getDay()))];
  const forecastHTML = uniqueDays.map(day => {
    const dayData = forecastDaily.find(forecastDay => new Date(forecastDay.dt * 1000).getDay() === day);
    return `
      <div class="col">${showWeekdays(dayData.dt)}</div>
      <div class="col">
        <img src="http://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png" alt="" width="42" />
      </div>
      <div class="col">
        <span id="high">${Math.round(dayData.main.temp_max)}°</span>
        <span id="low">${Math.round(dayData.main.temp_min)}°</span>
      </div>
    `;
  }).join("");

  forecastElement.innerHTML = `<div class="row row-cols-3" id="head">${forecastHTML}</div>`;
};




const getWeatherData = city => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrl)
    .then(response => {
      showWeather(response);
      showForecast(response);
    });
};

const enterCity = event => {
  event.preventDefault();
  const city = document.querySelector("input.city").value;
  document.querySelector("#userCity").innerHTML = city.charAt(0).toUpperCase() + city.slice(1);
  getWeatherData(city);
  document.getElementById('header').classList.add('hidden');
  document.getElementById('today').classList.remove('hidden');
};

const showWeather = response => {
  let temp = document.querySelector("#temp");
  let celsius = response.data.list[0].main.temp;
  temp.innerHTML = Math.round(celsius);

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `<b>Humidity</b> ${response.data.list[0].main.humidity}%`;

  let wind = document.querySelector("#wind");
  wind.innerHTML = `<b>Wind speed</b> ${Math.round(response.data.list[0].wind.speed)}`;

  let descr = document.querySelector("#description");
  descr.innerHTML = response.data.list[0].weather[0].description;

  let weatherIcon = document.querySelector("#icon");
  let iconCode = response.data.list[0].weather[0].icon;
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconCode}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.list[0].weather[0].main);

  $("span.units").show();
  $("#units").show();

  // Map
  maptilersdk.config.apiKey = "uWIkkOudLeqGl9dH8rgx";
  var map = new maptilersdk.Map({
    container: "map",
    style: maptilersdk.MapStyle.CITIES,
    center: [response.data.city.coord.lon, response.data.city.coord.lat],
    zoom: 7,
  });

  let marker = new maptilersdk.Marker()
    .setLngLat([response.data.city.coord.lon, response.data.city.coord.lat])
    .addTo(map);

  document.getElementById("src").addEventListener("click", function () {
    map.flyTo({
      center: [response.data.city.coord.lon, response.data.city.coord.lat],
      essential: true,
    });
  });

  showForecast(response);
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


document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('forecast').classList.add('hidden');
  document.getElementById('today').classList.add('hidden');

});
