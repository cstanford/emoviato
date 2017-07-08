(function() {
    'use strict';

    angular.module('emoviato.ui.controllers').controller('HomeController', Controller);

    Controller.$inject = ['$log', '$state', '$stateParams', 'TrendService'];

    function Controller($log, $state, $stateParams, TrendService) {

      var trendContainer = TrendService.getTrendContainer();
      this.topTrends = trendContainer.trends;

      this.goToTrendReport = function(selectedTrend) {
        $state.go('app.trend_report', {'currentTrendName': selectedTrend.name, 'currentTrendId': selectedTrend._id});
      };


    }

    return Controller;
})();
