let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['g', 'google'],
  desc: 'Google something!',
  permission: '',
  usage: '<query>',
  args: 1,
  command: async function (msg, cmd, args) {
    let res = await google(args.join(' '))
    msg.channel.send({
      embed: {
        color: 4359924,
        title: res.title,
        url: res.url,
        description: res.desc
      }
    })
  }
}

async function google (query) {
  let url = 'http://google.com/search?hl=en&q=' + encodeURIComponent(query)
  let body = (await got(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    }
  })).body
  let $ = cheerio.load(body)
  let item = $('.LC20lb')[0]
  let tmp = item.parent.parent.next.children[0].children
  if (tmp.length && !tmp[0].children) {
    item = $('.LC20lb')[1]
    tmp = item.parent.parent.next.children[0].children
  }
  let desc = []
  if (tmp.length) tmp = tmp[0].children
  else if ($('.LGOjhe')[0]) {
    tmp = $('.LGOjhe')[0].children[0].children
  }
  for (let i = 0; i < tmp.length; i++) {
    if (tmp[i] && tmp[i].data) desc.push(tmp[i].data)
    else if (tmp[i].children[0] && tmp[i].children[0].data) {
      desc.push('**' + tmp[i].children[0].data + '**')
    }
  }
  if ($('.Z0LcW')[0]) {
    let maf = $('.Z0LcW')[0].children[0].data
    let urr = $('.qLLird')[0] ? $('.qLLird')[0].children[0].children[0].data : undefined
    let sol = $('.GzssTd')[0] ? $('.GzssTd')[0].children[0].children[0].data : undefined
    return {
      title: maf,
      desc: sol + (urr ? ` / ${urr}` : '')
    }
  }
  if ($('.cwcot.gsrt')[0]) {
    let maf = $('.cwclet')[0].children[0].data.trim()
    let sol = $('.cwcot.gsrt')[0].children[0].data
    return {
      title: 'Google Calculator',
      desc: (maf + sol).trim()
    }
  }
  if ($('.dDoNo.gsrt')[0]) {
    if ($('.vk_gy.vk_sh.Hg3mWc')[0]) {
      let a = []
      let b = []
      for (let j = 0; j < 2; j++) {
        a.push($('.vk_gy.vk_sh.Hg3mWc')[j].attribs.value)
        let y = $('.R9zNe.vk_bk.Uekwlc')[j].children
        for (let i = 0; i < y.length; i++) {
          if (y[i].attribs && y[i].attribs.selected) {
            b.push(y[i].children[0].data)
            break
          }
        }
      }
      return {
        title: 'Google Converter',
        desc: `${a[0]} ${b[0]} > ${a[1]} ${b[1]}`
      }
    } else {
      let mal = $('.dDoNo.gsrt')[0].children[0].children[0].data
      let sol = $('.PNlCoe.XpoqFe')[0].children[0].children[0].children[0].data
      return {
        title: mal,
        desc: sol
      }
    }
  }
  if ($('.rpnBye')[0]) {
    let a = []
    let b = []
    for (let j = 0; j < 2; j++) {
      a.push($('.rpnBye')[j].children[1].attribs.value)
      let y = $('.rpnBye')[j].children[3].children
      for (let i = 0; i < y.length; i++) {
        if (y[i].attribs && y[i].attribs.selected) {
          b.push(y[i].children[0].data)
          break
        }
      }
    }
    return {
      title: 'Google Converter',
      desc: `${a[0]} ${b[0]} > ${a[1]} ${b[1]}`
    }
  }
  if ($('.vk_bk.dDoNo')[0]) {
    let maf = $('.vk_bk.dDoNo')[0].children[0].data
    let dat = $('.vk_gy.vk_sh')[1]
    if (dat) {
      dat = dat.children
      let sol = []
      for (let i = 0; i < dat.length; i++) {
        if (dat[i].data) sol.push(dat[i].data)
        else if (dat[i].children[0].data) sol.push(dat[i].children[0].data)
      }
      let bef = $('.vk_gy.vk_sh')[1].next.next.children[0].data
      return {
        title: maf,
        desc: sol.join('') + '\n' + bef
      }
    } else {
      return {
        title: 'Google Time',
        desc: maf
      }
    }
  }
  return {
    title: item.children[0].data,
    url: item.parent.attribs.href,
    desc: desc.join('')
  }
}
