;(function(){
    var choreIt = angular.module('choreIt');

    choreIt.controller('AuthCtrl', ['$state', 'auth', function($state, auth) {
        var self = this;
        self.user = {};

        self.register = function() {
            auth.register(self.user).catch(function(error) {
                self.error = error;
                console.log(error.data.message);
            }).then(function() {
                if(!error) {
                    $state.go('home');
                }
            })
        };

        self.logIn = function() {
            auth.logIn(self.user).catch(function(error) {
                self.error = error;
                console.log(error.data.message);
            }).then(function() {
                if(!self.error) {
                    $state.go('home');                
                }
            })
        };
    }]);

})();