module.exports = {

    //NODE_ORACLEDB_USER이 있으면 그걸 쓰고, 없으면 suzi를 써라
    user:process.env.NODE_ORACLEDB_USER || 'suzi',
    password:process.env.NODE_ORACLEDB_PASSWORD || 'a123',
    connectString:process.env.NODE_ORACLEDB_CONNECTSTRING || 'localhost:1521/xe',
    //값이 있으면 true , 없으면 false
    externalAuth:process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false

}