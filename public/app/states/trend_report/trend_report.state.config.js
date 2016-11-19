angular.module('emoviato.ui.routes')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('app.trend_report', {
                url: '/trend_report?currentTrendName',
                views: {
                    "content@app": {
                        templateUrl: 'app/states/trend_report/trend_report.html',
                        controller: 'TrendController as trendController',
                        resolve: {
                            topTrends: ['$log', '$stateParams', '$location', 'ChartService',
                                function($log, $stateParams, $location, ChartService) {
                                    return ChartService.refreshTrendReportContainer($stateParams).then(function(response) { // Gets the new binding container when it needs to be updated
                                        return response.data;

                                    }.bind(this));
                                }
                            ]
                        }
                    },
                    params: {
                        currentTrendName: null,
                        trendData: null
                    }
                }
            });

    }]);