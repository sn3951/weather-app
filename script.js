const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm ]");
const searchInput = document.querySelector("[data-searchInput]");
const loadingScreen = document.querySelector(".loading-container");

let oldTab = userTab;
const API_KEY = "b7aa8c6bae80855bdf6ee8f043083c83";
oldTab.classList.add("current-tab")
getfromSessionStorage();

function switchTab(newTab) {
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab")
        oldTab = newTab
        oldTab.classList.add("current-tab")

        if (!searchForm.classList.contains("active")) {
            //kya search wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active")
            grantAccessContainer.classList.remove("active")
            searchForm.classList.add("active")
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h
            searchForm.classList.remove("active")
            userInfoContainer.classList.add("active")
            //ab main your weather tab me aa gaya hu, toh weather bhi display karna padega,so lets check local storage first
            //for coordinates,if we have saved them there
            getfromSessionStorage()

        }


    }

}


userTab.addEventListener("click", () => {
    //pass the clicked tab as parameters
    switchTab(userTab)
})
searchTab.addEventListener("click", () => {
    //pass the clicked tab as parameters
    switchTab(searchTab)
})
//check if coordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates")
    if (!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active")
    }
    else {
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates
    // make grantcontainer visible
    grantAccessContainer.classList.remove("active")
    //make loader visible
    loadingScreen.classList.add("active")

    //API call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        const data = await response.json()
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
    }
    catch (err) {
        loadingScreen.classList.remove("active")
    }
}
function renderWeatherInfo(weatherInfo) {
    //fristly, we have to fetch the elements 
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudness]");

    //fetch values from weather info object and put it in UI elements
    cityName.innerText = weatherInfo?.name
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.main;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        grantAccess.style.display = "none";

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


const grantAccess = document.querySelector("[data-grantAccess]")
grantAccess.addEventListener("click", getLocation)

searchForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let cityName = searchInput.value;


    if (cityName === "") return

    else
        fetchSearchWeatherInfo(cityName)
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active")
    userInfoContainer.classList.remove("active")
    grantAccessContainer.classList.remove("active")

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)

        const data = await response.json()
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
    }
    catch (error) {
        console.log(error);
        loadingScreen.classList.remove("active");
    }


}