;(function(){
    var choreIt = angular.module('choreIt');

    choreIt.factory('auth', ['$window', '$http', '$state', function($window, $http, $state) {        
        var auth = {};

        auth.getToken = function() {
            return $window.localStorage['choreIt-token'];
        };

        auth.saveToken = function(token) {
            $window.localStorage['choreIt-token'] = token;
        };

        auth.logOut = function() {
            $window.localStorage.removeItem('choreIt-token');
            $state.go('home');
        };

        auth.register = function(user) {
            return $http.post('/register', user).then(function(response) {
                if(response.data.token) {
                    auth.saveToken(response.data.token);
                }
            });
        };

        auth.logIn = function(user) {
          console.log(user);
          return $http.post('/login', user).then(function(response) {
                if(response.data.token) {
                    auth.saveToken(response.data.token);
                }
            });  
        };

        auth.isLoggedIn = function() {
            var token = auth.getToken();
            if(token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.exp > Date.now() / 1000; //in seconds
            } else {
                return false;
            }
        }

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