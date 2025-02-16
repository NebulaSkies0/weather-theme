const root = document.querySelector(':root');

let time, sunrise, sunset, temperature, cloud, precipitation, wind

time = Date.now() / 1000

//time = new Date(2025, 1, 16, 1) //Test times
//time = time.getTime()/1000

//Gets the weather for OU
getWeather()

//Requests the API and fills the variables
async function getWeather(latitude = 35.19879047087778, longitude = -97.44495060227347) {
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

        readOverrides()

    } catch (error) {
        console.error(error.message)
    }
}

function readOverrides() {
    if (document.getElementById('time_input').value) {
        let input_time = document.getElementById('time_input').value.split(':')
        let date = new Date()
        
        date.setHours(input_time[0])
        date.setMinutes(input_time[1])
        
        //if (date.getTime() > sunrise) {
        //    date.setDate(date.getDate()-1)
        //    console.log(date)
        //}
        time = date.getTime()/1000
    }
    if (document.getElementById('temperature_input').value) {
        temperature = document.getElementById('temperature_input').value
    }
    if (document.getElementById('cloud_input').value) {
        cloud = document.getElementById('cloud_input').value
    }
    if (document.getElementById('precipitation_input').value) {
        precipitation = document.getElementById('precipitation_input').value
    }
    if (document.getElementById('wind_input').value) {
        wind = document.getElementById('wind_input').value
    }

    updateInformation()
    updateStyle()
}

//Updates all the CSS in the document
function updateStyle() {
    if (!sunrise) return //If there is nothing in sunrise, then the API was probably not reached

    let background = new Color('skyblue')

    //console.log(nightMultiplier())
    background.hsv.v *= nightMultiplier()

    background.hsv.v *= 1 - Math.min(precipitation, 8)/10
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
    
    return easeInOut(Math.min(Math.abs(
        ((time - (sunrise + sunset) / 2) / (sunrise - sunset))
    ), 1))
}

function easeInOut(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}