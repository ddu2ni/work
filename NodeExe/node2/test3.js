var Calc = require('./calc')

var calc = new Calc();

//emit을 써서 stop이라는 이벤트을 찾음
//그럼 stop이라는 이벤트가 호출돼서 그 안에 내용 실행
calc.emit('stop')

console.log(Calc.title)