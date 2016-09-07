const nconf = require('nconf');
const path = require('path');
/**
 * Using the nconf node module to provide a default configuration
 * for the a node program, this module allows us to pass arguments
 * on the command line or via a json file to override the defaults.
 *
 * Note, the json file is always optional, and is expected to be added
 * by clients, devs, or dev ops.
 *
 *
 *      Above, where you would expect a few of the defaults to be autoWatch and singleRun
 *
 *
 *      var path = require('path');
 *      var nconf = require('server-config-loader')(path.normalize('./custom.conf.json'), {
 *          port: 9876
 *      });
 */
module.exports = function(customFilePath, defaults) {
    //Load command line arguments and env vars.
    nconf.argv().env();

    try {
        //Try to load a custom env json file.
        console.log('emoviato-ui-server-config-loader: Attempting to load custom properties from path ' + customFilePath);
        nconf.file({
            file: customFilePath
        });
    } catch(err) {
        console.log('Failed to load configuration at path: ' + customFilePath);
        console.log('Make sure the above configuration json file is a strictly formatted JSON object using double quotes for keys and string values.');
        throw err;
    }

    //Finally, specify defaults not in the custom json file or on the command line.
    //These will only "win" if they aren't in the json or on the command line.
    nconf.defaults(defaults);

    //fix paths to be absolute.
    var paths = nconf.get('paths');
    for(var key in paths) {
        console.log('emoviato-ui-server-config-loader: Resolving path   paths:' + key + ' ' + path.resolve(paths[key]));
        nconf.set('paths:' + key, path.resolve(paths[key]));
    }

    console.log('All server configuration properties...');
    console.log(JSON.stringify(nconf.get(), null, 4));

    return nconf;
};
