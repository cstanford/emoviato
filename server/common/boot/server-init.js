(() => {
    'use strict';

    const bodyParser = require('body-parser');
    const compression = require('compression');
    const cookieParser = require('cookie-parser');
    const express = require('express');
    const helmet = require('helmet');
    const http = require('http');
    const morgan = require('morgan');
    const path = require('path');
    const Q = require('q');
    const mongoose = require('mongoose');

    module.exports = function(nconf) {
        return {
            initialize: function(){
                let isHttpEnabled = true;

                /**
                * TODO: Prep for https
                */
                let appConfigurations = [
                    {
                        enabled: isHttpEnabled,
                        name: 'http',
                        app: express(),
                        server: http,
                        port: nconf.get('port')
                    }
                ];

                appConfigurations.forEach((appConfig) => {
                    if(appConfig.enabled === true) {
                        this.initLogging(appConfig.app);//should happen first.
                        this.setupHelmet(appConfig.app);
                        this.setupCompression(appConfig.app);
                        this.setupBodyparser(appConfig.app);
                        this.setupCookieParser(appConfig.app);
                        this.setupMongoose(appConfig.app);
                        this.initFilters(appConfig.app, nconf.get('filters'), nconf.get('paths:serverDir'));
                        this.initRouter(appConfig.app, nconf.get('routers'), nconf.get('paths:serverDir'));
                        this.initStaticFiles(appConfig.app, nconf.get('staticDirs'));
                    }
                });

                this.finalize(appConfigurations);

                return appConfigurations;
            },
            //Methods below are alphebetized for readability

            /**
            * Initializes the filters found in the server-config-options module
            * as well as any server/custom.conf.json_* files
            * Filters are sorted by the order value on each filter config object.
            *
            * The filters handler should have one public function which returns the function
            * one would pass into app.use(urlPattern, function(req, res, next) {});
            */
            initFilters: function(app, filters, serverRoot) {
                /**
                 * Values generator. Yields each value of an Object's keys.
                 */
                const values = function * values(obj) {
                    for (let prop of Object.keys(obj)) {
                        yield obj[prop];
                    }
                };

                let filtersArr = Array.from(values(filters));
                let filterComparisonMethod = function(filter1, filter2){
                    let returnVal = 0;
                    if(filter1.order < filter2.order){
                        returnVal = -1;
                    } else {
                        returnVal = 1;
                    }

                    return returnVal;
                };

                filtersArr.sort(filterComparisonMethod)
                    .forEach((filterConfig) => {
                        if(filterConfig.enabled === true) {
                            console.log('Creating filter - order:', filterConfig.order, 'urlPattern:', filterConfig.urlPattern, 'handler:', filterConfig.handler);
                            app.use(filterConfig.urlPattern, require(path.join(serverRoot, filterConfig.handler))(filterConfig.opts, nconf));
                        } else {
                            console.log('Skipping filter - order:', filterConfig.order, 'urlPattern:', filterConfig.urlPattern, 'handler:', filterConfig.handler);
                        }
                    });
            },
            initLogging: function(app){
                app.use(morgan('dev'));
            },
            /**
            * Registers the express routers with the app.
            */
            initRouter: function(app, routers, serverRoot) {
                /**
                 * Set all routes to allow AJAX requests. This is necessary so that the drm-ui can request
                 * resources on servers that are not itself.
                 */
                app.use((req, res, next) => {
                    res.header('Access-Control-Allow-Origin', req.headers.origin);
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, x-auth-token, Content-Type, Accept');
                    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                    next();
                });

                let routeMetadata = null;
                for(let routeKey in routers) {
                    console.log('Creating router for path: ' + routeKey);
                    routeMetadata = routers[routeKey];
                    if(routeMetadata.enabled === true) {
                        routeMetadata.opts.app = app;
                        routeMetadata.opts.nconf = nconf;
                        app.use(routeKey, require(path.join(serverRoot, routeMetadata.router))(routeMetadata.opts).configure());
                    } else {
                        console.log('Skipping disabled router for ' + routeKey);
                    }
                }
            },
            initStaticFiles: function(app, staticDirs){

                //Configure express to serve static files such as js files, css, images.
                for(let i = 0; i < staticDirs.length; i++) {
                    console.log('Serving static dir: ' + staticDirs[i]);
                    app.use(express.static(staticDirs[i]));
                }

                /**
                * This is a catch all handler. This should be the last 'route' defined.
                * This will handle a request to any resource that does not exist and treat it
                * as an initial application login attempt. This will make note of the user supplied
                * URL and pass it on to the authentication route, which is the root '/' route.
                */
                app.use((req, res) => {
                    console.log('Direct access to a state requested. State: ' + req.originalUrl);
                    res.sendFile(path.join(__dirname,'..','..','..','public','index.html'));
                });
            },
            /**
             * Configure app to use body-parser module.
             * This will let us get the data from a POST.
             */
            setupBodyparser: function(app) {
                app.use(bodyParser.json({limit: '10mb'}));
                app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
            },
            setupCookieParser: function(app){
                app.use(cookieParser());
            },
            setupCompression: function(app){
                app.use(compression());
            },
            setupHelmet: function(app) {
                app.use(helmet());
            },
            setupMongoose: function(){
                mongoose.Promise = require('q').Promise;
            },
            //END alphabetized list.
            //Note: Finalize method last for readability
            /**
            * Start listening for each app (http/https).
            */
            finalize: function(appConfigurations) {

                //array of promises, to determine when all servers are listening (http and https).
                let allServersListening = [];

                //begin listening on each enabled server
                appConfigurations.forEach((appConfig) => {
                    if(appConfig.enabled === true) {
                        appConfig.isListening = Q.defer();
                        allServersListening.push(appConfig.isListening.promise);

                        if(appConfig.serverOptions) {
                            appConfig.runtimeServer = appConfig.server.createServer(appConfig.serverOptions, appConfig.app);
                        } else {
                            appConfig.runtimeServer = appConfig.server.createServer(appConfig.app);
                        }
                        appConfig.runtimeServer.listen(appConfig.port, null, null, () => {
                            console.log('Listening on', appConfig.name, 'port', appConfig.port);
                            appConfig.isListening.resolve(appConfig);
                        });
                    }
                });

                // listen for TERM signal .e.g. kill
                process.on ('SIGTERM', process.exit);
                // listen for INT signal e.g. Ctrl-C
                process.on ('SIGINT', process.exit);

                process.on('uncaughtException', function(err) {
                    console.log('UncaughtException:');
                    console.log(err);
                });

                Q.all(allServersListening).then(() => {
                    console.log(nconf.get('appName') + ': Application booted successfully in ' + this.getMode().toUpperCase() + ' mode.');
                });
            }
        };
    };
})();
