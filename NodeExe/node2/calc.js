
//Calc는 내가 만든거라서 process를 가지고 있지 않음
//그래서 상속받게 해줘야함


var Calc = function(){

    this.on('stop',function(){
        console.log('test3에서 stop event 받음')
    })

}

//public class Calc extends EventEmmiter{...}

//상속을 가능하게 해주는 내장모듈
var util = require('util')

//EventEmitter의 위치 =  events라는 모듈 안에 있음
var eventEmitter = require('events').EventEmitter

//유틸을 통해 상속받으면 됨
util.inherits(Calc,eventEmitter)


//외부에서 쓸 수 있게끔/호출 -> require 허락하려면   [module.exports]
module.exports = Calc;
module.exports.title = '계산기'