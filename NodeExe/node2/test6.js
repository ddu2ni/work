var fs = require('fs')

//동기화방식
fs.writeFileSync('./output.txt','오늘은 수요일',function(err){

    if(err){
        console.log(err)
    }
    console.log('파일쓰기 완료!')

})