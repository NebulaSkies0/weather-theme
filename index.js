import Color from "https://colorjs.io/dist/color.js";

const root = document.querySelector(':root');

let time, sunrise, sunset, temperature, cloud, precipitation, wind

time = Date.now() / 1000

//time = new Date(2025, 1, 16, 1) //Test times
//time = time.getTime()/1000

//Gets the weather for OU
getWeather(35.19879047087778, -97.44495060227347)

//Requests the API and fills the variables
async function getWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,precipitation,cloud_cover,wind_speed_10m&daily=sunrise,sunset&timeformat=unixtime&past_days=1&forecast_days=1`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const json = await response.json()

        sunrise = time < sunset ? json.daily.sunrise[0] : json.daily.sunrise[1]
        sunset = json.daily.sunset[0]
        temperature = json.current.apparent_temperature
        cloud = json.current.cloud_cover
        precipitation = json.current.precipitation
        wind = json.current.wind_speed_10m

        updateStyle()
        updateInformation()

    } catch (error) {
        console.error(error.message)
    }
}

//Updates all the CSS in the document
function updateStyle() {
    if (!sunrise) return //If there is nothing in sunrise, then the API was probably not reached

    let background = new Color('skyblue')

    background.hsv.v *= nightMultiplier()

    background.hsv.v *= 1 - precipitation / 150
    background.hsv.s *= 1 - cloud / 100

    root.style.setProperty('--background', background.toString())
    
    //Invert the text's value color based off the background
    let text = new Color('black')
    text.hsv.v = 100-background.hsv.v
    root.style.setProperty('--text', text.toString())
}

function updateInformation() {
    document.getElementById('temperature').innerHTML = temperature
    document.getElementById('cloud').innerHTML = cloud
    document.getElementById('precipitation').innerHTML = precipitation
    document.getElementById('wind').innerHTML = wind
}

//Returns a value to multiply by the background's light value
function nightMultiplier() {
    return Math.min(Math.abs(
        ((time - (sunrise + sunset) / 2) / (sunrise - sunset)) ** 0.5
    ), 1)
}