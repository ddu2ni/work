/*
    노드의 자바스크립트의 객체와 함수

	자료형
	Boolean,Number,String,Undefined,null,Object

    //두개가 같은 의미이긴하나 다름
	Undefined : 값을 할당하지않은 변수(단순히 값이 없음) - 값이 있으면 나올 수 있음
	null : 존재하지 않는 값(의도적으로 값이 없음) - 아예 데이터가 없는것
*/


//자바스크립트의 객체
var Person = {}; //(클래스)객체 만든 것

//전역변수 만들고 그 안에 데이터 넣음
//[]로도 만들 수 있고, .변수 만들어서 값을 넣어줄 수도 있음
Person['name'] = "배수지";
Person['age'] = 29;
Person.mobile = '010-1111-3333';

console.log(Person.name);
console.log(Person.age);
console.log(Person.mobile);
console.log(Person['name']);
console.log(Person["mobile"]);


/*
- JAVA

int add(int a,int b){...}

- Javascript
function add(a,b){...}

자바스크립트는 모든지 다 넣을 수 있음 (변수에도 함수를 할당)
var add = 10; 
var add = function(a,b){...} 

*/

function add1(a,b){
    return a+b;
}

var result = add1(10,20);
console.log(result);

console.log('-------------------------------------------');

var add2 = function (a,b){
    return a+b;
}

var result = add2(100,200);
console.log(result);

console.log('-------------------------------------------');

var Person1 = {};
Person1['name'] = '유인나';
Person1['age'] = 40;
Person1.mobile = '010-2222-3333';

//클래스안의 변수에다가 함수를 넣은 것 
Person1.add3 = function(a,b){
    return a + b;
}

console.log(Person1.add3(30,40));

console.log('-------------------------------------------');

//함수를 만들어놓고 따로 추가할 수 있음
var add4 = function (a, b) {
    return a + b;
}

//복잡하지않게 맞춰준 것 뿐이고, 이름 맞출 필요는 없음
Person1['add4'] = add4;

console.log(Person1.add4(50,50));

console.log('-------------------------------------------');

//JSON형태처럼 객체생성 가능
var Person2 = {
        name:'정인선',
        age: 30,
        add5: function(a,b){
            return a + b;
        }
}

console.log(Person2.add5(50,60));
console.log(Person2.name);
