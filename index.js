const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const grantAccessButton = document.querySelector("[data-grantAccess]");

const notFoundimg = document.querySelector("[notFound]");

// initially  variable need



let oldTab = userTab;
const API_KEY = "b0413a8829e9a5b5ce9979ceddf7fab6";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
  if (newTab != oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      // i was in the search tab and now i am switching to your weather tab
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      // display weather so lets check local stoarge first for coordinates, if we have saved them there
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  // pass clicked tab as input
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  // pass clicked tab as input
  switchTab(searchTab);
});

// check if cordinates are already present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    // local Coordinates are not saved
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const {lat, lon} = coordinates;
  // make grant container invisible
  grantAccessContainer.classList.remove("active");
  // make loader visible
  loadingScreen.classList.add("active");

  // API call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    // hw
  }
}

function renderWeatherInfo(weatherInfo) {

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");

  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-Cloudiness]");

  // fetch values from weather Info object and put it on the UI
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity} %`;
  cloudiness.innerText = weatherInfo?.clouds?.all;
}

function getLocation() {
  if (navigator.geolocation) {
    // navigator.geolocation.getCurrentPosition(showPosition);
    navigator.geolocation.getCurrentPosition(showPosition);
    console.log("location found");
  } else {
    // show an alert for no geolocation for no support available
    alert("No Geolocation Support");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="")
    return;
    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
      // console.log(err);
      // loadingScreen.classList.remove("active");
      // userInfoContainer.classList.remove("active");
      // notFoundimg.classList.add("active");
    }
}