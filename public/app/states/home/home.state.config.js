angular.module('emoviato.ui.routes')
    .config(['$stateProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app.home', {
                url: '/home',
                views: {
                    "content@app": {
                        templateUrl: 'app/states/home/home.html',
                        controller: 'HomeController as homeController',
                        resolve: {
                            topTrends: ['$log', '$stateParams', 'ChartService',
                                function($log, $stateParams, ChartService) {
                                    return ChartService.refreshContainer().then(function(response) { // Gets the new binding container when it needs to be updated
                                        $log.debug(response.data);
                                        return response.data;

                                    }.bind(this));
                                }
                            ]
                        }
                    }
                }
            });
  }]);

