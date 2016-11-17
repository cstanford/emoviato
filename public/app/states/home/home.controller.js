(function() {
    'use strict';

    angular.module('emoviato.ui.controllers').controller('HomeController', Controller);

    Controller.$inject = ['$log', '$state', '$stateParams', 'StateTransitionService'];

    function Controller($log, $state, $stateParams, StateTransitionService) {

      this.demoTrends = [
        {
          trendName: 'Harambe',
          img: 'http://www.wkyc.com/img/resize/content.wkyc.com/photo/2016/05/30/harambe_1464603004882_2564895_ver1.0.jpg?preset=534-401'
        },
        {
          trendName: 'TrumpTrain',
          img: 'http://www.snopes.com/wordpress/wp-content/uploads/2016/02/the-new-yorker-who-is-donald-trump.jpeg'
        },
        {
          trendName: 'WikiLeaks',
          img: 'https://wikileaks.org/IMG/rubon32.png?1467279700'
        },
        {
          trendName: 'NFLKickoff',
          img: 'http://www.buccaneers.com/assets/images/imported/TB/2015/news/10/article/15-nfl-logo.jpg'
        },
        {
          trendName: 'Lit',
          img: 'https://i.ytimg.com/vi/QUk6tPE4vuI/maxresdefault.jpg'
        }
      ];

        this.goToTrendReport = function($index) {
            console.log($index);
            $state.go('app.trend_report', {trendData: $index});
        };

  }

    return Controller;
})();
