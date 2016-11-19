(function () {
    'use strict';
    angular.module('emoviato.ui.services').service('ChartService', Service);

    Service.$inject = ['$log', '$http', '$state', '$stateParams'];
    function Service($log, $http, $state, $stateParams){
        var topTrendsContainer = {
            topTrends: {

            }
        };

        var trendReportContainer = {
            trendData: {

            }
        };

        var path = '/app/web-data/';

        var getTopTrends =  function(){

            var requestString =  path + 'topTrends.json';
            $log.debug('requestSting: ' + requestString);

            return $http.get(requestString).then(function(response){
                topTrendsContainer.topTrends = response.data;
                $log.debug("in service: getTopTrends()");
                $log.debug(response.data);
                return response;
            });
        };

        var getTrendInfo = function (trendNameOb) {
            $log.debug('in service getTrendInfo()');
            var trendName = trendNameOb.currentTrendName;
            $log.debug(trendName);
            var requestString = path + 'current-trending-tweets/' + trendName + '.json';

            return $http.get(requestString).then(function (response) {
                trendReportContainer.trendData = response.data;
                return response;
            });
        };


        return {
            refreshTopTrendsContainer: function () {
                return getTopTrends();
            },
            getTopTrendsContainer: function(){
                return topTrendsContainer;
            },
            refreshTrendReportContainer: function (trendName) {
                return getTrendInfo(trendName);
            },
            getTrendReportContainer: function(){
                return trendReportContainer;
            }
        };

    }

    return Service;
})();