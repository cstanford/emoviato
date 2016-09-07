/**
 * This script will execute the "full build" on the UI application.
 *      Usage: 
 *          node build.js
 *
 * NOTE: Requires environment variable:
 *      Unix: export NODE_PATH=<Node.js installation>/lib/node_modules:./node_modules
 *      Windows: set NODE_PATH=<Node.js installation>\node_modules;.\node_modules
 */
var npm = require('npm');
var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var NODE_MODULES = 'node_modules';

/**
 * Options which will be passed to all npm commands.
 */
var loadOptions = {
    'strict-ssl': false
};

var hostedRegistry = null; //we don't have a hosted registry yet....

var buildPlatform = process.platform;
console.log(__filename, ': Build platform is', buildPlatform);
var npmCommand = (buildPlatform.indexOf('win') > -1) ? 'npm.cmd' : 'npm';

/**
 * Due to a security issue with npm, we are using "npm config set ignore-scripts true"
 * This prevents "npm install" from running any post install scripts.
 * Some modules do need the post install scripts to run, so they can be specified here, and the 
 * build will run those install scripts for each specified module.
 *
 * Example:
 * {
 *     module: 'phantomjs-prebuilt',
 *     scripts: ['install']
 * }
 *
 */
var npmScriptPostInstallWhitelist = [
    
];

/**
 * The following will synchronously delete a folder and everything within.
 */
var deleteFolderRecursive = function(path) {
    if(fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { 
                // recurse
                deleteFolderRecursive(curPath);
            } else { 
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        
        fs.rmdirSync(path);
    }
};

/**
 * Any folders to be fully deleted before building.
 */
var cleanFolders = [
    path.join(__dirname, 'gulp', NODE_MODULES),
    path.join(__dirname, 'server', NODE_MODULES)
];

/**
 * Deletes the node_modules folders.
 */
var clean = function(paths) {
    for(var i = 0; i < paths.length; i++) {
        console.log('Cleaning/Deleting folder:', paths[i]);
        deleteFolderRecursive(paths[i]);
    }
};

/**
 * Defaults the registry to gntbuild, if not set.
 */
var npmInstallAndBuild = function(loadOptions) {
    npm.load(loadOptions, function () {
        var registry = npm.config.get('registry');
        if(hostedRegistry && registry.indexOf('registry.npmjs.org') > -1) {
            console.log(__filename, ': npm registry is set to registry.npmjs.org (default). Switching to', hostedRegistry);
            loadOptions.registry = hostedRegistry;
        } else {
            //hostedRegistry is not defined OR Developer has defined the registry using npm config, to point to a local or other.
            console.log(__filename, ': Using developer defined registry:', registry);
            loadOptions.registry = registry;
        }
        console.log(__filename, ': Using npm registry:', loadOptions.registry, 'to download third party dependencies.');
        downloadNodeAppDependencies(loadOptions);
    });
};

/**
 * Checks to see if there is a bower directory in the repo root, 
 * and if so, triggers a "bower install" on that directories' bower.json.
 */
var doBowerInstall = function() {
    //ensure the bower directory exists.
    fs.stat(path.join(__dirname, 'bower'), function(err, stats) {
        if(!err && stats.isDirectory()) {
            console.log(__filename, ': Downloading third party bower modules from config: bower/bower.json');
            var bowerCommand = (buildPlatform.indexOf('win') > -1) ? 'bower.cmd' : 'bower';
            var childProcess = spawn(bowerCommand, ['install'], {
                cwd: path.join(__dirname, 'bower'),
                env: process.env
            });
            childProcess.stdout.on('data', function(data) {
                process.stdout.write(data.toString());
            });
            childProcess.on('close', function(code) {
                console.log(__filename, ': "bower install" child process finished with code', code);
            });
            return childProcess;
        }
    });
};

/**
 * Default handler we will call after the npm install calls back as finished.
 */
var npmInstallLoggingHandler = function(err, stdout, stderr, options) {
    if(err) {
        console.log(__filename, ': Failed to download dependencies for node application:', options.cwd);
        console.log(__filename, ': stderr:', stderr);
        throw err;
    }
    console.log(stdout);
    console.log(__filename, ': Successfully downloaded third party npm modules for', options.cwd);
};

/**
 * The command we will use to install third party dependencies.
 */
var npmInstallCmd = 'npm install --strict-ssl false --registry ';

var runPostInstallScriptsForModule = function(nodeApp, whiteListModule, Q) {
    
    var modulePath = path.join(nodeApp.path, NODE_MODULES, whiteListModule.module);
    
    var runScript = function(scriptName) {
        var deferred = Q.defer();
        fs.stat(modulePath, function(err, stats) {
            if(err) {
                deferred.reject(err);
                return;
            }
            
            var args = ['run-script', '--ignore-scripts', 'false', scriptName];
            console.log(__filename, ': Running post install for', modulePath, 'with command', npmCommand, args.join(' '));
            var options = {
                cwd: modulePath,
                env: process.env,
                stdio: 'inherit' //feed all child process logging into parent process
            };
            var childProcess = spawn(npmCommand, args, options);
            childProcess.on('close', function(code) {
                var msg = __filename + ': post install complete for ' + modulePath;
                console.log(msg);
                deferred.resolve(msg);
            });
            return childProcess;
        });
        return deferred.promise;
    };
    
    //always run the first script. There will be one to many.
    var promise = runScript(whiteListModule.scripts[0]);
    
    //run any additional scripts index 1 - infinity linearly.
    for(var i = 1; i < whiteListModule.scripts.length; i++) {
        promise.then(runScript(whiteListModule.scripts[i]));
    }
    
    return promise;
};

var runPostInstallScripts = function(nodeApp) {
    var Q = require(path.join(nodeApp.path, NODE_MODULES, 'q'));
    var postInstalls = [];
    for(var i = 0; i < npmScriptPostInstallWhitelist.length; i++) {
        postInstalls.push(runPostInstallScriptsForModule(nodeApp, npmScriptPostInstallWhitelist[i], Q));
    }
    //each app can potentially need to run scripts on multiple modules, so wait for all to complete.
    return Q.all(postInstalls);
};

var postInstallScriptsComplete = function() {
    console.log('PostInstall complete for', this.path);
};

/**
 * A bit of configuration for where the node applications live,
 * and what to do when the dependencies finish downloading.
 */
var nodeApps = [
    {
        path: path.join(__dirname, 'server'),
        callback: function(code, nodeApp) {
            if(code === 0) {
                runPostInstallScripts(nodeApp).finally(postInstallScriptsComplete.bind(nodeApp));
            }
        }
    },
    {
        path: path.join(__dirname, 'gulp'),
        callback: function(code, nodeApp) {
            if(code === 0) {
                runPostInstallScripts(nodeApp).then(function(allPostInstalls) {
                    postInstallScriptsComplete.call(nodeApp);
                    console.log(__filename, ': Building app with gulp');
                    //require in the defined gulp tasks
                    process.chdir(path.join(__dirname, 'gulp'));
                    var gulp = require('gulp');
                    //gulpfile needs to be loaded after gulp
                    require(path.join(__dirname, 'gulp', 'gulpfile.js'));
                    
                    gulp.start('fullbuild');
                });
            }
        }
    }
];

/**
 * Fires "npm install <options>" in a child process. 
 * NOTE: We ended up doing this in a child process instead of using npm.commands.install
 * because we saw issues after the nodejs 5.1.0 upgrade. After the upgrade, having multiple 
 * npm.commands.install in one process resulting in the second node app missing many dependencies.
 * Running this in a child process seems to work flawlessly.
 */
var fireNpmInstall = function(nodeApp, npmLoadOptions) {
    var args = ['install', '--ignore-scripts', 'true', '--strict-ssl', 'false', '--registry', npmLoadOptions.registry];
    console.log(__filename, ': Downloading third party npm modules for', nodeApp.path, 'with command:', npmCommand, args.join(' '));
    var options = {
        cwd: nodeApp.path,
        env: process.env,
        stdio: 'inherit' //feed all child process logging into parent process
    };
    var childProcess = spawn(npmCommand, args, options);
    childProcess.on('close', function(code) {
        console.log(__filename, ': "npm install" for', nodeApp.path, 'child process finished with code', code);
        if(typeof nodeApp.callback === 'function') {
            nodeApp.callback(code, nodeApp);
        }
    });
    return childProcess;
};

/**
 * Downloads node application dependencies from a folder containing a package.json.
 */
var downloadNodeAppDependencies = function(npmLoadOptions) {
    npmInstallCmd = npmInstallCmd + npmLoadOptions.registry;
    for(var x = 0; x < nodeApps.length; x++) {
        fireNpmInstall(nodeApps[x], npmLoadOptions);
    }
};

/**
 * Kicks off the build, which will:
 * 1. Download bower dependencies
 * 2. Download third party dependencies for the gulp folder's package.json
 * 3. Build the gulp app, run lint (jshint)
   4. Download third party dependencies for the server folder's package.json
 */
var beginBuild = function() {
    clean(cleanFolders);
    doBowerInstall();
    npmInstallAndBuild(loadOptions);
};

beginBuild();