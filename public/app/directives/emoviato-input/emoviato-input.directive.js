/**
 * DashboardDirective is the base-most Directive via inheritance.
 * All Directives in all views should inherit from this ultimate
 * parent, which is attached to the <body> tag.
 */
(function(){
    'use strict';

    angular.module('emoviato.ui.directives').directive('emoviatoInput', Directive);

    Directive.$inject = ['$state'];
    function Directive($state) {

        return {
            template:'<input />',
            replace: true
        };
    }

    return Directive;
})();
