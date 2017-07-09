angular.module('emoviato.ui.routes')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('app.trend_report', {
                url: '/trend_report?currentTrendName?currentTrendId',
                views: {
                    "content@app": {
                        templateUrl: 'app/states/trend_report/trend_report.html',
                        controller: 'ReportController as reportController',
                        resolve: {
                            currentTrend: ['$log', '$stateParams', '$location', 'TrendService',
                                function($log, $stateParams, $location, TrendService) {
                                    return TrendService.refreshCurrentTrend($stateParams.currentTrendId).then(function(response) { // Gets the new binding container when it needs to be updated
                                        return response.data;

                                    }.bind(this));
                                }
                            ]
                        }
                    },
                    params: {
                        'currentTrendName': null,
                        'currentTrendId': null
                    }
                }
            });

    }]);