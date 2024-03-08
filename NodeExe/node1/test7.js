//프로토타입 객체 만들기
//이미 변수가 만들어져있음

//Person={} 이렇게 만든 것을
//초기화를 해서 this쓰는 것 = 프로토타입
//만들 때 부터 변수를 가지고 있고, 이 함수는 변하지 않음
function Person(name,age){
    this.name = name;
    this.age = age;
}

//그래서 walk함수로 속성을 추가할 수 있음
Person.prototype.walk = function(speed){
    if(speed>30){
        console.log(speed + 'km 속도로 뛰어갑니다')
        return
    }
        console.log(speed + 'km 속도로 걸어갑니다')
}

//원본을 다이렉트로 못쓰니까 객체생성
var person1 = new Person('수지',30);
var person2 = new Person('인나',28);

console.log(person1.name + '가 걸어가고 있습니다')
person1.walk(10)

console.log(person2.name + '가 뛰어가고 있습니다')
person1.walk(40)