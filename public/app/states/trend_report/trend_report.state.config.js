angular.module('emoviato.ui.routes')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('app.trend_report', {
                url: '/trend_report/:trendData',
                views: {
                    "content@app": {
                        templateUrl: 'app/states/trend_report/trend_report.html',
                        controller: 'TrendController as trendController'
                    },
                    params: {trendData: null}
                }
            });

    }]);