;(function() {
    var choreIt = angular.module('choreIt');
    //Controller for navbar, just passes to auth service
    choreIt.controller('NavCtrl', ['auth', function(auth) {
        var self = this;
        self.isLoggedIn = auth.isLoggedIn;
        self.currentUser = auth.currentUser;
        self.logOut = auth.logOut;
    }]);
})();