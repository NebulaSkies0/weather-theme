const root = document.querySelector(':root');

let time, sunrise, sunset, temperature, cloud, precipitation, wind

//Gets the weather for OU
getWeather(35.19879047087778, -97.44495060227347)

//Requests the API and fills the variables
async function getWeather(latitude, longitude){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,precipitation,cloud_cover,wind_speed_10m&daily=sunrise,sunset&timeformat=unixtime&past_days=1&forecast_days=1`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const json = await response.json()

        time = json.current.time
        sunrise = time < sunset ? json.daily.sunrise[0] : json.daily.sunrise[1]
        sunset = json.daily.sunset[0]
        temperature = json.current.apparent_temperature
        cloud = json.current.cloud_cover
        precipitation = json.current.precipitation
        wind = json.current.wind_speed_10m

        updateStyle()

    } catch (error) {
        console.error(error.message)
    }
}

//Updates all the CSS in the document
function updateStyle() {
    if (!time) return //If there is nothing in time, then the API was probably not reached

    //Examples
    root.style.setProperty('--background', color(127, 127, 255));
    root.style.getPropertyValue('--background')
}

//Returns a value between 0-1 for the current progress through the daylight; Negative if night
function daylight_cycle() {
    if (time < sunset) {
        return (time - sunrise) / (sunset - sunrise)
    }
    else {
        return (time - sunset) / (sunset - sunrise)
    }
}

//Returns a string for use in CSS
function color (r, g, b) {
    return `rgb(${r}, ${g}, ${b})`
}