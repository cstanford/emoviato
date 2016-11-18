var app = angular.module('app', [
    //BEGIN third party modules
    'ngSanitize',
    'ngAria',
    'ngAnimate',
    'ngMessages',
    'ngCookies',
    'ui.router',
    'ui.bootstrap',
    'angular-chartist',
    'highcharts-ng',
    //END third party modules
    //BEGIN Do Re ME (emoviato) modules
    'emoviato.ui.routes',
    'emoviato.ui.services',
    'emoviato.ui.controllers',
    'emoviato.ui.directives',
    'emoviato.ui.filters'
    //END emoviato modules
]);


app.config(function ($provide, $httpProvider, $locationProvider, $compileProvider) {
    //Boosts performance: https://docs.angularjs.org/guide/production
    //$compileProvider.debugInfoEnabled(false);

    $httpProvider.defaults.withCredentials = true;

    //html5Mode allows for regular urls, no hashbang.
    //when you set this, you must also set the <base /> element in the index.html
    $locationProvider.html5Mode(true);
});

//Note: Need to initialize the state of the application
app.run(['$state', function ($state) {
}]);
