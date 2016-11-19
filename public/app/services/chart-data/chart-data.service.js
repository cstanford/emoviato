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

        var path = '/app/python/web-data/';

        var getTopTrends =  function(){

            var requestString =  path + 'topTrends.json';
            $log.debug('requestSting: ' + requestString);

            return $http.get(requestString).then(function(response){
                topTrendsContainer.topTrends = response.data;
                $log.debug(response.data);
                return response;
            });
        };

        var getTrendInfo = function (trendName) {
            var requestString = path + 'currentTrendTweets/' + trendName + '/JsonParsed.json';

            return $http.get(requestString).then(function (response) {
                trendReportContainer.trendData = response.data;
                $log.debug("getTrendInfo()");
                $log.debug(response.data);
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
                return getTopTrends();
            },
            getTrendReportContainer: function(){
                return trendReportContainer;
            }
        };

    }

    return Service;
})();