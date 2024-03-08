/*
배열 만들고 요소 추가하기

push() : 마지막에 데이터 추가
pop() : 마지막 데이터 삭제
unshift() : 맨앞에 데이터 추가
shift() : 맨앞에 데이터 삭제
splice() : 여러 데이터 추가/삭제
slice() : 잘라내서 새로운 배열 만들기

*/

//배열을 만들 땐 대괄호
//JSON형태 데이터
var Users = [{name:'수지',age:29},{name:'인나',age:40}];

Users.push({name:'신혜',age:35});

console.log(Users.length + '개');
console.log(Users[0].name);
console.log(Users[1].name);
console.log(Users[2].name);

//전체 데이터 뽑을 때 dir
console.dir(Users);

//json형태가 아닌 순수 데이터만 나옴
for(var i=0; i <Users.length; i++){
    console.log(Users[i].name + " : " + Users[i].age);
}

Users.forEach(function(item,index){
    //index = 일렬번호
    console.log(index + " : " + item.name +  " : " + item.age);
});

console.log('---------------------------------------------------------')

//삭제
Users.splice(0,1);
//index 0번부터 시작해서 1개의 데이터
for(var i=0; i <Users.length; i++){
    console.log(Users[i].name + " : " + Users[i].age);
}

console.log('---------------------------------------------------------')


//배열에 함수도 넣을 수 있음
var add = function(a,b){
    return a + b;
}

Users.push(add);
console.log(Users[2](10,20));
for(var i=0; i <Users.length; i++){
    console.log(i+ " : " + Users[i].name);
}

console.log('---------------------------------------------------------')

Users.push({name:'효리',age:40})
Users.push({name:'지연',age:43})

for(var i=0; i <Users.length; i++){
    console.log(i+ " : " + Users[i].name);
}

console.log('---------------------------------------------------------')

//마지막 데이터 삭제
Users.pop();
for(var i=0; i <Users.length; i++){
    console.log(i+ " : " + Users[i].name);
}

console.log('---------------------------------------------------------')

//맨 처음 데이터 삭제
Users.shift();
for(var i=0; i <Users.length; i++){
    console.log(i+ " : " + Users[i].name);
}


console.log('---------------------------------------------------------')

//맨 처음 데이터 추가
Users.unshift({name:'지현',age:30});
for(var i=0; i <Users.length; i++){
    console.log(i+ " : " + Users[i].name);
}

console.log('---------------------------------------------------------')
//중간 데이터 삭제
//실제로 지워진 건 아님
delete Users[1];

//제이슨 형태로 보여짐
console.log(Users);

// for(var i=0; i <Users.length; i++){
//     console.log(i+ " : " + Users[i].name);
// }

console.log('---------------------------------------------------------')

//여러개 데이터 추가/삭제
Users.splice(1,0,{name:'인선',age:20})
console.log(Users)

console.log('---------------------------------------------------------')

Users.splice(2,1)

 for(var i=0; i <Users.length; i++){
    console.log(i+ " : " + Users[i].name);
 }

 console.log('---------------------------------------------------------')
 
 console.log(Users.length + '개');  //전체데이터개수
 console.log(Users); 

 //1-3까지 
 //slice = 배열을 잘라서 다른 배열에 저장함
var Users2 = Users.slice(1,3) // 3-1
console.log(Users)
console.log(Users2)


console.log('---------------------------------------------------------')
 
//1부터 끝까지 배열을 잘라서 다른 새로운 배열에 갖다붙임
var Users3 = Users.slice(1)
console.log(Users)
console.log(Users3)