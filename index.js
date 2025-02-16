import Color from "https://colorjs.io/dist/color.js";

const root = document.querySelector(':root');

let sunrise, sunset, temperature, cloud, precipitation, wind

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

        sunrise = Date.now()/1000 < sunset ? json.daily.sunrise[0] : json.daily.sunrise[1]
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
    if (!sunrise) return //If there is nothing in sunrise, then the API was probably not reached
    
    const time = Date.now()/1000

    let background = new Color("lightblue")

    //background.hsv.v *=

    background.hsv.v *= 1 - precipitation/150
    background.hsv.s *= 1 - cloud/100

    root.style.setProperty('--background', background.toString())
}

//Returns a value between 0-1 for the current progress through the daylight; Negative if night
//function daylight_cycle() {
//    console.log((Date.UTC(2025, 1, 16, 1)/1000 - sunrise) / (sunset - sunrise))
//    if (Date.now()/1000 < sunset) {
//        return (Date.now()/1000 - sunrise) / (sunset - sunrise)
//    }
//    else {
//        return (Date.now()/1000 - sunset) / (sunset - sunrise)
//    }
//}

//Doesn't work, but will return a value to multiply by the background's light value
function nightMultiplier() {
    let time = new Date(2025, 1, 16, 0)
    console.log(time)
    time = time.getTime()/1000

    console.log((time - sunrise) / (sunrise - sunset))
}