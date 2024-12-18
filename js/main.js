let weather = document.getElementById("weather");
let search = document.getElementById("search");
let arrWeather = [];
let lastSearch = "cairo";

navigator.geolocation.getCurrentPosition(
  (position) => {
    let myLat = position.coords.latitude;
    let myLong = position.coords.longitude;
    getData(`${myLat},${myLong}`);
  },
  (error) => {
    console.error("Geolocation not allowed or failed:", error);

    getData(lastSearch);
  }
);

async function getData(location = "cairo") {
  weather.innerHTML = "<p>Loading...</p>";
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=a8eaf1cdb8444f2586f132301241812&q=${location}&days=3&aqi=no&alerts=no`
    );
    let data = await response.json();
    arrWeather = {
      locationName: data.location.name,
      forecastData: data.forecast.forecastday,
      current: data.current,
      condition: data.current.condition,
    };

    lastSearch = location;
    createWeatherTemplate();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    weather.innerHTML =
      "<p>Error fetching weather data. Please try again later.</p>";
  }
}

function createWeatherTemplate() {
  if (!arrWeather || arrWeather.forecastData.length === 0) {
    weather.innerHTML = "<p>No weather data available.</p>";
    return;
  }

  let date = new Date();

  const formatDay = (offset) => {
    let newDate = new Date();
    newDate.setDate(date.getDate() + offset);
    return newDate.toLocaleString("en-US", { weekday: "long" });
  };

  let day = formatDay(0);
  let dayNext = formatDay(1);
  let dayNext2 = formatDay(2);

  let month = date.toLocaleString("en-US", { month: "long" });
  let dayOfMonth = date.getDate();

  weather.innerHTML = `
    <div class="col-md-12 col-lg-4 text-white">
      <div class="today_weather">
        <div class="today_header d-flex justify-content-between" id="today">
          <div class="day">${day}</div>
          <div class="date">${dayOfMonth} ${month}</div>
        </div>
        <div class="content_today" id="current">
          <div class="location">${arrWeather.locationName}</div>
          <div class="degree d-flex">
            <div class="num me-5">
              ${arrWeather.forecastData[0].day.maxtemp_c}<sup>o</sup>C
            </div>
            <div class="weather_icon">
              <img src="https:${arrWeather.forecastData[0].day.condition.icon}" alt="${arrWeather.forecastData[0].day.condition.text}" class="mt-3 w-100">
            </div>
          </div>
          <div class="custom">${arrWeather.forecastData[0].day.condition.text}</div>
          <span class="me-4">
            <img src="./images/icon-umberella@2x.png" alt="" class="me-2">
            ${arrWeather.forecastData[0].day.daily_chance_of_rain}%
          </span>
          <span class="me-4">
            <img src="./images/icon-wind@2x.png" alt="" class="me-2">
            ${arrWeather.forecastData[0].day.maxwind_kph} km/h
          </span>
          <span class="me-4">
            <img src="./images/icon-compass@2x.png" alt="" class="me-2">
            ${arrWeather.current.wind_dir}
          </span>
        </div>
      </div>
    </div>

    <div class="col-md-12 col-lg-4 text-white">
      <div class="second_today text-center">
        <div class="today_header text-center">
          <div class="day">${dayNext}</div>
        </div>
        <div class="content_today">
          <div class="weather_icon">
            <img src="https:${arrWeather.forecastData[1].day.condition.icon}" alt="${arrWeather.forecastData[1].day.condition.text}" class="mt-3">
          </div>
          <div class="degree d-flex flex-column align-items-center justify-content-center">
            <div class="num">
              ${arrWeather.forecastData[1].day.maxtemp_c}<sup>o</sup>C
            </div>
            <p>
              ${arrWeather.forecastData[1].day.mintemp_c}<sup>o</sup>C
            </p>
          </div>
          <div class="custom">${arrWeather.forecastData[1].day.condition.text}</div>
        </div>
      </div>
    </div>

    <div class="col-md-12 col-lg-4 text-white">
      <div class="third_today text-center">
        <div class="today_header text-center">
          <div class="day">${dayNext2}</div>
        </div>
        <div class="content_today">
          <div class="weather_icon">
            <img src="https:${arrWeather.forecastData[2].day.condition.icon}" alt="${arrWeather.forecastData[2].day.condition.text}" class="mt-3">
          </div>
          <div class="degree d-flex flex-column align-items-center justify-content-center">
            <div class="num">
              ${arrWeather.forecastData[2].day.maxtemp_c}<sup>o</sup>C
            </div>
            <p>
              ${arrWeather.forecastData[2].day.mintemp_c}<sup>o</sup>C
            </p>
          </div>
          <div class="custom">${arrWeather.forecastData[2].day.condition.text}</div>
        </div>
      </div>
    </div>
  `;
}

search.addEventListener("input", (e) => {
  let country = e.target.value.trim();
  if (country.length > 2) {
    getData(country);
  } else if (country.length === 0) {
    getData(lastSearch);
  }
});

window.onload = function () {
  getData();
};
