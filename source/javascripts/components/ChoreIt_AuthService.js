;(function(){
    var choreIt = angular.module('choreIt');

    //Service for authenticating users
    choreIt.factory('auth', ['$window', '$http', '$state', function($window, $http, $state) {        
        var auth = {};

        //Retrieve token from local storage
        auth.getToken = function() {
            return $window.localStorage['choreIt-token'];
        };

        //save token to local storage
        auth.saveToken = function(token) {
            $window.localStorage['choreIt-token'] = token;
        };

        //log out by deleting a users local token
        auth.logOut = function() {
            $window.localStorage.removeItem('choreIt-token');
            $state.go('home');
        };

        //register a user - if successful, save their token
        auth.register = function(user) {
            return $http.post('/register', user).then(function(response) {
                if(response.data.token) {
                    auth.saveToken(response.data.token);
                }
            });
        };

        //log in a user - if successful, save their token
        auth.logIn = function(user) {
          console.log(user);
          return $http.post('/login', user).then(function(response) {
                if(response.data.token) {
                    auth.saveToken(response.data.token);
                }
            });  
        };

        //Checks for local token and expiration.  If good, return true
        auth.isLoggedIn = function() {
            var token = auth.getToken();
            if(token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.exp > Date.now() / 1000; //in seconds
            } else {
                return false;
            }
        }

        //returns current user, from local token
        auth.currentUser = function() {
            if(auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.username;
            }
        }
        
        return auth;
    }]);


})();