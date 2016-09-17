/**
 * This module exists in order to wrap the mongoose api third party module
 * to provide promise based communication with MongoDB, avoiding callbacks.
 */

const mongoose = require('mongoose');
const Q = require('Q');

module.exports = function(dbConfigs){
    let disconnect = function(dbName){
        console.log('Mongo Api Wrapper: Connection to '+dbName+' closing.');
        return mongoose.disconnect();
    };

    let connect = function(dbName, deferred){
        let conf = dbConfigs[dbName];
        console.log('Mongo Api Wrapper connecting to: mongodb://'+conf.host+':'+conf.port+'/'+conf.name);

        mongoose.connect('mongodb://'+conf.host+':'+conf.port+'/'+conf.name, conf);

        let db = mongoose.connection;

        db.on('error', function(){
            deferred.reject('connection error:');
        });

        db.once('open', function() {
            let connectionInfo = {
                db: db,
                done: function(){ disconnect(dbName); }
            };

            deferred.resolve(connectionInfo);
        });
    };

    return {
        mongooseWrapper: function(dbName){
            let deferred = Q.defer();
            connect(dbName, deferred);

            return deferred.promise;
        },
        initDatabases: function(){
            let promises = [];

            for(let dbKey in dbConfigs){
                let dbName = dbConfigs[dbKey].name;
                let deferred = Q.defer();

                connect(dbName, deferred);

                promises.push(deferred.promise);
            }

            return Q.all(promises);
        }
    };
};
