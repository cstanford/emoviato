(function () {
    'use strict';
    angular.module('emoviato.ui.services').service('ChartService', Service);

    Service.$inject = ['$log', '$http', '$state', '$stateParams'];
    function Service($log, $http, $state, $stateParams){
        var bindingContainer = {
            topTrends: {

            }
        };

        var getTrends =  function(){

            var requestString =  '/app/python/topTrends.json';

            return $http.get(requestString).then(function(response){
                bindingContainer.topTrends = response.data;
                return response;
            });
        };

        var init = function(){
            getTrends();
        };

        init();

        return {
            refreshContainer: function () {
                return getTrends();
            },
            getBindingContainer: function(){
                return bindingContainer;
            }
        };

    }

    return Service;
})();