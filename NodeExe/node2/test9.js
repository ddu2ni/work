//폴더만들기
var fs = require('fs')

fs.mkdir('./doc', function (err) {

    if (err) {
        throw err
    }

    console.log('폴더 생성!')

})

fs.mkdir('./doc', function (err) {

    if (err) {
        throw err
    }

    console.log('폴더 삭제!')

})