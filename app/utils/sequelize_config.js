'use strict';

var Sequelize = require('sequelize');
var instance = null;

function createInstance(){
    return new Sequelize(process.env.DATABASE_URL,{
    dialect: 'postgres',
    protocol: 'postgres',
    "logging": process.env.DATABASE_LOGGING ? process.env.DATABASE_LOGGING : false,
    native: true,
    dialectOptions: {
        ssl: true
    },
    define: {
      syncOnAssociation: true
    }
});
}


module.exports = function () {

  return {
    sequelize: createInstance()
};

}();
