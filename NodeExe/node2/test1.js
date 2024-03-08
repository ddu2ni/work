//url : 내장모듈 => import해줘야 함
var url = require('url')

var curUrl = url.parse('https://m.search.naver.com/search.naver?ssc=tab.m.all&where=m&sm=mtb_jum&query=angelina+danilova')

var curStr = url.format(curUrl)

console.log(curStr)
console.log(curUrl)

//querystring : 내장모듈
var queryStr = require('querystring')

var param = queryStr.parse(curUrl.query)

console.log(param.query)
console.log(queryStr.stringify(param))
