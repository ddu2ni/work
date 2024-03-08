//log(동작/상태 기록하는것) 처리 모듈
var winston = require('winston')

//하루하루 일별로 처리할것임/
//외부파일을 불러와야 사용할 수 있음
var winstonDaily =  require('winston-daily-rotate-file')

//로그파일 만들기
var logger = winston.createLogger({
   
    //로그를 만드는 룰, 규칙

    //로그수준(debug:0->info:1->notics:2->warning:3->
    //error:4->crit:5->alert:6->emerg:7)

    level:'info',
    format:winston.format.simple(),
    transports:[

        //에러가 떴으면 Console에 출력해라
        new(winston.transports.Console)({
            colorize:true
        }),
        new (winstonDaily)({
            filename:'./log/server_%DATE%.log',
            maxSize:'10m',
            datePattern:'YYYY-MM-DD HH-mm-ss'
        })
    ]
})

module.exports = logger;
