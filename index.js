const root = document.querySelector(':root');

root.style.setProperty('--background', 'grey')

getWeather(35.19879047087778, -97.44495060227347)

async function getWeather(latitude, longitude){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=relative_humidity_2m,apparent_temperature,precipitation,rain,snowfall,cloud_cover,wind_speed_10m&temperature_unit=fahrenheit`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const json = await response.json()
        console.log(json.latitude)
    } catch (error) {
        console.error(error.message)
    }
}