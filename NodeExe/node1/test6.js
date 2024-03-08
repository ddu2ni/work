//콜백함수
//함수를 파라미터(인수)로 전달함(=비동기방식)

//a.b를 받아서 처리한 다음에 callback를 호출해라
//비동기방식의 함수를 만드는 것
//결과가 처리될 때까지 기다릴 필요가 없음
//가장 많이 쓰는 구조임

/*
function add(a,b,callback){

    var result = a + b;

    //result를 돌려줌
    callback(result);

}

add(10,20,function(result){

    console.log('합계: ' + result)

});
*/

//히스토리 콜백함수
function add(a,b,callback){

    var result = a + b;

    //result를 돌려줌
    callback(result);

    var history = function(){
        return a + '+' + b + '=' + result
    }
    //함수의 결과값으로 리턴될 수 있음
        return history
}

var history = add(10,20,function(result){

    console.log('합계: ' + result)

});
console.log(history())