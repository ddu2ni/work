module.exports = {
    serverPort :  3000,
    dbUrl : 'mongodb://localhost:27017/shopping',

    dbSchemas:[
        {file:'./userSchema',collection:'users4',schemaName:'UserSchema',modelName:'UserModel'}
    ],

    routeInfo:[
      
    ]
} 