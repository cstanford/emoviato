(function() {
    'use strict';

    angular.module('emoviato.ui.controllers').controller('TrendController', Controller);

    Controller.$inject = ['$log', '$state', '$stateParams', 'StateTransitionService'];

    function Controller($log, $state, $stateParams, StateTransitionService) {

        this.trendData = $stateParams;

        this.testParams = function () {
            console.log(this.trendData);
        };


    }

    return Controller;
})();