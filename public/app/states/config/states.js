var module = angular.module('emoviato.ui.routes', [
    'ui.router'
]);

module.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
            abstract: true,
            url: '',
            views: {
                root: {
                    templateUrl: 'app/states/layout/root.html',
                    resolve: {

                    }
                }
            }
        });

        $urlRouterProvider.otherwise('/home');

}]);
