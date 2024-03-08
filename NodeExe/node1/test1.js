//전역객체와 메소드
//console 객체의 메소드 종류(dir,time,timeEnd)	
//process 객체의 메소드 종류(argv, env, exit)
//exports 객체의 메소드 종류

var result = 0;

//"계산시간" = id라고 부름
console.time("계산시간");


for(var i=1;i<=1000;i++){
    result += i;
}

console.timeEnd("계산시간");
console.log("1부터 1000까지 더한 결과: " + result);

console.log("현재 실행하는 파일 이름: " + __filename);
console.log("현재 실행하는 파일 경로: " + __dirname);

console.log("-------------------------------------");

var Person = {name:"배수지",age:29}
console.log(Person)
console.dir(Person) //dir: 개체 속성 보여주는 명령어

console.log("-------------------------------------");
//argv:파라미터의 갯수
console.dir(process.argv) 
console.log(process.argv.length + '개')

process.argv.forEach(function(item,index){
    console.log(index + " : " + item);
});

console.log(process.env)