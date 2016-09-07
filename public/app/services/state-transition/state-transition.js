(function () {
    'use strict';
    angular.module('emoviato.ui.services').service('StateTransitionService', Service);
     
    Service.$inject = ['$log', '$state'];
    function Service($log, $state){
        return {
           go: function(state, param, config){
                    $state.go(state, param, config);
            }
        };
    }

    return Service;
})();
