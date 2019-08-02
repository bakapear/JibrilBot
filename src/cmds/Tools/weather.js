let got = require('got')
let key = process.env.API_WEATHER

module.exports = {
  name: ['weather'],
  desc: 'Get weather information of a location',
  permission: '',
  usage: '<city(,country code)>',
  args: 1,
  command: async function (msg, cmd, args) {
    let query = args.join(' ')
    let body = await getWeather(query)
    if (!body) msg.channel.send('Nothing found!')
    else if (body.message) msg.channel.send(body.message)
    else {
      console.log(body)
      let temp = x => (x - 273.15).toFixed(2)
      if (body.weather.length > 4) body.weather.length = 3
      let desc = `**Weather**: ${body.weather.map(x => x.main).join(' \\> ')}\n`
      desc += `**Temp**: ${temp(body.main.temp)}°C (${temp(body.main.temp_min)}-${temp(body.main.temp_max)})\n`
      desc += `**Wind**: ${body.wind.speed}m/s ${body.wind.deg}°`
      msg.channel.send({ embed: {
        color: 9756159,
        title: `Weather in ${body.name} [${body.sys.country}]`,
        description: desc
      } })
    }
  }
}

async function getWeather (query) {
  try {
    let url = 'https://api.openweathermap.org/data/2.5/weather'
    let { body } = await got(url, {
      query: {
        q: query,
        APPID: key
      },
      json: true
    })
    return body
  } catch (e) { return null }
}
