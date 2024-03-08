//웹서버 만들기

var http = require('http')
var fs = require('fs')

//서버객체 만들기
var server = http.createServer();

//50000 = 동시접속자 수 (생략가능)
var host = '192.168.16.16';
var port = 3000
server.listen(port,host,50000,function(){
    console.log('웹서버가 시작되었습니다: ' + port)
})

//클라이언트 연결이벤트 처리 
server.on('connection',function(socket){
    console.log('클라이언트가 접속했습니다: '  + socket.remoteAddress + ":" + socket.remotePort)
})

//클라이언트 요청을 처리하는 이벤트 
server.on('request',function(req,res){
    console.log('클라이언트 요청이 들어왔습니다.');

    var fileName = './image/photo_1701045756 (2).jpg'

    //비동기방식으로 file이름을 읽어라
    fs.readFile(fileName,function(err,data){

        res.writeHead(200,{"Content-Type":"image/jpeg"});
        res.write(data);
        res.end();

    })

})



//서버 종료 이벤트 
server.on('close',function(){
    console.log('서버가 종료됩니다.')
});