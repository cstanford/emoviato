/**
 * This is the main server start script. 
 * We use an npm module, nconf, to create an extendable server configuration object.
 * The nconf object is then passed into the express initialization, where the initialization 
 * pulls information about this server's configuration.
 */
(() => {
    'use strict';
    const defaultConfiguration = require('./common/boot/server-config-options')();
    
    //Extend the specific deployment custom.conf.json onto the source controlled defaults, for 
    //environment-specific configuration.
    try{
        let nconf = require('./common/boot/server-config-loader')('./custom.conf.json', defaultConfiguration);
        /* let app =  */ require('./common/boot/server-init')(nconf).initialize();
    }catch(err){
        throw err;
    }
})();
