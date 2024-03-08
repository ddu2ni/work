/*

이벤트 
    - EventEmitter : 이벤트를 주고 받음
    - process : 내부적으로 EventEmitter를 상속받음
   - on(event,function) : 이벤트가 전달될 객체에 이벤트 리스너 설정(실행할 이벤트)
   - emit() : 이벤트를 다른쪽으로 전달하는 메소드(이벤트 호출)

*/

//process는 내장모듈이라 바로 쓸 수 있음
//exit는 내장되어있는 이벤트 이름이라 - 바꿀 수 없음
//on : 작업 - 어떤 이벤트를 할건지 

process.on('exit',function(){
    console.log('exit 이벤트 발생함')
});

//몇초가 지나면 자동으로 처리
setTimeout(function(){
    console.log('4초후 이벤트 호출함')
    //process는 자동으로 emit을 가지고 있기때문에 이름으로 호출했고, 아니였음 emit()으로 호출해야함
    process.exit() 
},4000)



//함수(매개변수)가지고 있음
process.on('tick',function(count){
    console.log('tick 이벤트 발생함' + count)
})

//tick 공통이름 공유하면 이벤트 호출 할 수 있음
//이벤트는 파일을 나눌 수 있음
setTimeout(function(){
    console.log('2초 후에 tick이벤트 발생함')
    process.emit('tick','5')    
},2000)