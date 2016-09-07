angular.module('emoviato.ui.routes')
    .config(['$stateProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app.home', {
                url: '/home',
                views: {
                    "content@app": {
                        templateUrl: 'app/states/home/home.html',
                        controller: 'HomeController as homeController'
                    }
                }
		      });

    }]);
