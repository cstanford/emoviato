const extend = require('node.extend');
/**
 * Provides the default server configuration for the emoviato-ui server.
 * If you are a developer who wishes to extend this configuration for another server, providing
 * a modified default configuration, you should pass in an overrides object which will be deep-extended.
 *
 * If you are a client wanting to provide client-specific overrides, you should use the custom.conf.json
 * in the same directory as the server.js file.
 */
module.exports = function(overrides) {

    overrides = (overrides) ? overrides: {};

    return extend(true, {
        /**
         * The application's name.
         */
        appName: 'emoviato-ui',
        /**
         * The HTTP port of the server.
         */
        port: 11000,
        /**
         * Common paths the server will use.
         */
        paths: {
            appRootDir: '..',
            serverDir: '../server',
            schemaDir: '../server/common/schemas',
            modulesDir: '../server/common/modules',
            appDir: '../public/app'
        },
        /**
         * Directories that express will make publicly accessible
         */
        staticDirs: [
            '../public'
        ],
        /**
        * The url/request limit size.
        * The Express default is 1mb.
        */
        requestSizeLimit: '10mb',
        /**
         * Express routers/REST endpoints.
         *
         * Expresss routing documentation located here: http://expressjs.com/en/guide/routing.html
         */
        routers: {
            '/api/test': {
                enabled: true,
                router: 'apis/test/test-router',
                opts: {
                    data: 'api/test Mock: You can send in configuration to router here.'
                }
            },
            '/api/trend': {
                enabled: true,
                router: 'apis/trend/trend-router',
                opts: {
                }
            },
        },
        filters: {
        },
        modules: {
        },
        servers: {
            mongo: {
                databases: {
                    'emoviatodb': {
                        name: 'emoviatodb',
                        enabled: true,
                        host: 'localhost',
                        port: 10100
                    }
                }
            }
        }

    }, overrides);

};
