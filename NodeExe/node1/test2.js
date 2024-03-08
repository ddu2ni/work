//모듈 나누기 (exports)

/*
1.객체 사용(module.exports 분리)

var calc={};

calc.add=function(a,b){
	return a+b;
};
calc.mul=function(a,b){
	return a*b;
};

module.exports = calc;


2.속성 사용 (exports 분리)
exports.add=function(a,b){
	return a+b;
};
exports.mul=function(a,b){
	return a*b;
};
*/

//import하는 방법
//'./calc1'파일을 불러오고, 그 이름을 calc1이라고 지정함
var calc1 = require('./calc1');
var calc2 = require('./calc2');


var calc = {};

calc.add = function(a,b){
    return a + b;
};

console.log('모듈 분리 전 add 호출 :' + calc.add(10,20));
console.log('모듈 분리 후 add 호출 :' + calc1.add(100,200));
console.log('모듈 분리 후 mul 호출 :' + calc2.mul(10,20));



