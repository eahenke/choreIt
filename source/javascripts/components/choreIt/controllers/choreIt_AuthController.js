;(function(){
    var choreIt = angular.module('choreIt');

    //Controller for authenticating users
    choreIt.controller('AuthCtrl', ['$state', 'auth', function($state, auth) {
        var self = this;
        self.user = {};

        //calls auth service to register user - if no error, redirect to chores state
        self.register = function() {
            auth.register(self.user).catch(function(error) {
                self.error = error;
                console.log(error);
            }).then(function() {
                if(!self.error) {
                    $state.go('chores');
                }
            })
        };

        //calls auth service to log in user - if no error, redirect to chores state
        self.logIn = function() {
            //don't save errors across multiple attempts
            self.error = null;

            auth.logIn(self.user).catch(function(error) {
                self.error = error;
                console.log(error.data.message);
            }).then(function() {
                if(!self.error) {
                    $state.go('chores');                
                }
            })
        };
    }]);

})();