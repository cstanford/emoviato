(function () {
    'use strict';
    angular.module('emoviato.ui.services').service('TrendService', Service);

    Service.$inject = ['$log', '$http', '$state', '$stateParams'];
    function Service($log, $http, $state, $stateParams){

        var trendContainer = {
          trends: [],
          currentTrend: null
        };

        var getTopTrending =  function() {
            var requestString = '/api/trend/get-topTrending/';
            return $http.get(requestString).then(function(response){
                trendContainer.trends = response.data.trends;
                $log.debug(response);
                return response;
            });
        };

        var getCurrentTrend = function(trendId) {
            var requestString = '/api/trend/get-currentTrend/' + trendId;
            return $http.get(requestString).then(function(response){
                trendContainer.currentTrend = response.data.trends;
                $log.debug(response);
                return response;
            });
        };

        var init = function(){
            getTopTrending();
        };

        init();

        return {
            refreshTopTrending: function () {
                return getTopTrending();
            },
            refreshCurrentTrend: function (trendId) {
                return getCurrentTrend(trendId);
            },
            getTrendContainer: function(){
                return trendContainer;
            }
        };

    }

    return Service;
})();