(function(){
    'use strict';
    
    /**
     * This script is used to import dayZero data into a target db
     */
    //arguments, slice off first two 'node' and 'import'
    let args = process.argv.slice(2);

    if(!args[0] || !args[1] || args[0] === 'help' || args[0] === '?') {
        console.info('********************************************************************************************************');
        console.info('****************************************Data Import Help************************************************');
        console.info('********************************************************************************************************');
        console.info('*  DEVS: Adding a new data import script                                                               *');
        console.info('*      1) Create a new folder in the dayZero/<database> folder with a name that describes the import.  *');
        console.info('*      2) Add a .js file in the folder named the same as folder.                                       *');
        console.info('*      3) Implement exactly like server/common/utility/dayZero/userdb/importCollections.js             *');
        console.info('*         3a) Export a function that accepts an object containing mongoose and the db connection info. *');
        console.info('*         3b) Return an object containing a "runImport" method.                                        *');
        console.info('*         3c) runImport method must return a "thenable" promise.                                       *');
        console.info('*                                                                                                      *');
        console.info('*  node import usage                                                                                   *');
        console.info('*      node import <databse name> <fileName>                                                           *');
        console.info('*                                                                                                      *');
        console.info('*          Example:                                                                                    *');
        console.info('*          node import userdb importUsers                                                              *');
        console.info('********************************************************************************************************');
        console.info('********************************************************************************************************');
        process.exit(0);
    }

    const databaseName = args[0];
    const targetImport = args[1];        
    const path = require('path');
    
    //load dbconfig
    const offlineConfig = require('../../config/offline.config.json');
    //pass to wrapper service
    const mongoApiWrapper = require('../../modules/mongodb-api-wrapper/mongo-api-wrapper')(offlineConfig.mongo.databases);
    const importUtility = require(path.join(__dirname,databaseName,targetImport, targetImport))();

    mongoApiWrapper.mongooseWrapper(databaseName, 'connect').then(function(connectionData){
        
        importUtility.runImport().then(function(){
            console.log('DayZero Import: ' + databaseName + ' - ' + targetImport + ' completed successfully.');
        }, function(err){
            console.log('DayZero Import: ' + databaseName + ' - ' + targetImport + ' something went wrong.'); 
            console.log(err); 
        }).finally(function(){
            connectionData.done();
        });
    });
})();


