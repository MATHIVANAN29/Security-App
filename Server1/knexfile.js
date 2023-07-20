module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://postgres:postgres@localhost/securityapp',
    //connection: 'postgres://postgres@localhost/securityapp',


    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
    directory: __dirname + '/db/seeds/development'
    }

  },

};
