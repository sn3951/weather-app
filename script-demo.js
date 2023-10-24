const API_KEY = "b7aa8c6bae80855bdf6ee8f043083c83";
async function showWeather() {
    let city = "goa"
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)

    const data = await response.json()
    console.log("Weather Data:-> ", data)

    let newPara = document.createElement('p')
    newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`

    document.body.appendChild(newPara)
}

async function getCustomWeatherDetails() {
    try {
        let latitude = 12.8165486
        let longitude = 80.0410357

        let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
        let data = await result.json()
        console.log(data)
    }
    catch (error) {
        console.log("error found" + err)
    }

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else {
        console.log("no geolocation supported0")
    }
}

function showPosition(position) {
    let lat = position.coords.latitude
    let longi = position.coords.longitude

    console.log(lat)
    console.log(longi)
}