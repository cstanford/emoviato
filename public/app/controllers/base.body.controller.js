/**
 * BaseBodyController is the base-most controller via inheritance.
 * All controllers in all views should inherit from this ultimate
 * parent, which is attached to the <body> tag.
 */
(function(){
    'use strict';

    angular.module('emoviato.ui.controllers').controller('BaseBodyController', Controller);

    Controller.$inject = ['$state'];
    function Controller($state) {

        this.test = function(){
            return "Success, we have a changed app!";

        };

    }

    return Controller;
})();
