//Oracle DB연결

const oracledb = require('oracledb')
const dbConfig = require('./dbConfig.js')

oracledb.autoCommit = true

oracledb.getConnection(

    {
    user:dbConfig.user,
    password:dbConfig.password,
    connectionString:dbConfig.connectString

    },
    function(err,conn){

        if(err) throw err

        console.log('Oracle DB 연결 성공~!')
        
        let sql

        /*
        //create------------------------------------------------------------------------------
        sql = 'create table gogak (id varchar2(10), password varchar2(10),'
        sql += 'name varchar2(10), age number)'

        conn.execute(sql)
        console.log('테이블 생성!!')
             

        //insert------------------------------------------------------------------------------
        //:뒤에는 문자로 써도되고, 1111써도되고 상관없음
        sql = 'insert into gogak values(:id,:pw,:name,:age)'
        
        
        //데이터 넣기
       // binds = [['suzi','a123','배수지',27]]

       //여러개의 데이터 -  json형태
        binds = [
            ['inna','a123','유인나',40],
            ['insun','a123','정인선',30],
            ['yeji','a123','서예지',35]
        ]
        
        //오라클은 잘 실행되면 1 아니면 0
        //{autoCommit:true} : insert가 시작되면 트랜잭션이 시작하니까 
        let result = conn.executeMany(sql, binds, {autoCommit:true},
            function(){
                console.log('입력 완료')
        })

  

       
        //update
        sql = 'update gogak set password=:pw,name=:name,age=:age where id=:id'
       
        conn.executeMany(sql,[['b777','예지',30,'yeji']])

        console.log('수정완료')


        //delete
        sql = 'delete gogak where id=:id'

        //id값 넣기
        conn.execute(sql,['yeji'])
        console.log('삭제완료')

         */


        //select
        sql = 'select id,password,name,age from gogak'


        // [] = 조건문 where에 id면 id값 넣어주면됨
        conn.execute(sql,[],function(err,result){

            if(err) throw err
            
            //행가져와라
            console.log(result.rows)

            dbClose(conn)

        })
    }
)

function dbClose(conn){

    conn.release(function(err){
        if(err) throw err
    })

}