//코딩으로 웹서버 만들기
var http = require('http')

//http 서버가 req로 들어오고, res로 내보냄
http.createServer(function handler(req,res){

    //writeHead 내보낼 때 쓰는 명령어
    //text/plain : 문자 
    // 잘 실행됐을 때 : 200 - 공용언어임
    // 
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('Node 안녕!!\n');

}).listen(1337, '192.168.16.16'); //1337, '192.168.16.16'일때 귀를 기울여라

console.log("Server running at http://192.168.16.16:1337");