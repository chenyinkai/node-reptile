const cheerio = require('cheerio')
const http = require('http')
const iconv = require('iconv-lite') // 编码转码
let index = 1 // 页数
let url = 'http://www.ygdy8.net/html/gndy/dyzz/list_23_'
let baseUrl = 'http://www.ygdy8.net'
let titles = [] // 标题
let detailUrls = [] // 详情页url
let loadUrl = [] // 下载链接

getData(url, index)

function getData (url, index) {
  console.log('正在获取第' + index + '页的内容')
  http.get(url + index + '.html', res => {
    let chunks = []
    res.on('data', chunk => {
      chunks.push(chunk)
    })
    res.on('end', () => {
      let html = iconv.decode(Buffer.concat(chunks), 'gb2312')
      let $ = cheerio.load(html, {
        decodeEntities: false
      })
      $('.co_content8 .ulink').each((idx, ele) => {
        var $ele = $(ele)
        detailUrls.push($ele.attr('href'))
        titles.push({
          title: $ele.text()
        })
      })
      if (index < 3) {
        index++
        getData(url, index)
      } else {
        console.log(titles)
        console.log(detailUrls)
        getLoadUrl(detailUrls[0], 0)
      }
    })
  })
}

function getLoadUrl (url, i) {
  console.log('正在获取第' + i + '个下载地址')
  console.log(baseUrl + url)
  http.get(baseUrl + url, res => {
    let chunks = []
    res.on('data', chunk => {
      chunks.push(chunk)
    })
    res.on('end', () => {
      let html = iconv.decode(Buffer.concat(chunks), 'gb2312')
      let $ = cheerio.load(html, {
        decodeEntities: false
      })
      $('#Zoom td').children('a').each((idx, ele) => {
        var $ele = $(ele)
        loadUrl.push({
          bt: $ele.attr('href')
        })
      })
      if (i < 10) {
        i++
        getLoadUrl(detailUrls[i], i)
      } else {
        console.log(loadUrl)
      }
    })
  })
}
