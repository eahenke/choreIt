//States
;(function(){
    var choreIt = angular.module('choreIt', ['ui.router']);

    choreIt.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
            //basic home state, prompt users to register or login
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
                controllerAs: 'main',
            })
            //state for logging in returning users
            .state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'AuthCtrl',
                controllerAs: 'auth',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if(auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }] //add in when wiring to backend, check if already logged
            })
            //state for registering new users
            .state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthCtrl',
                controllerAs: 'auth',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if(auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            });

        $urlRouterProvider.otherwise('home');

    }]);
})();
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
;(function(){
    var choreIt = angular.module('choreIt');

    choreIt.factory('auth', ['$window', '$http', function($window, $http) {        
        var auth = {};

        auth.getToken = function() {
            return $window.localStorage['choreIt-token'];
        };

        auth.saveToken = function(token) {
            $window.localStorage['choreIt-token'] = token;
        };

        auth.logOut = function() {
            $window.localStorage.removeItem('choreIt-token');
        };

        auth.register = function(user) {
            return $http.post('/register', user).then(function(response) {
                if(response.data.token) {
                    auth.saveToken(response.data.token);
                }
            });
        };

        auth.login = function(user) {
          return $http.post('/register', user).then(function(response) {
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
;(function(){
    var choreIt = angular.module('choreIt');

    choreIt.factory('chores', function() {
        var o = {
            //dummy data
            weeks: [
                {
                    week: 1,
                    chores: [
                        {
                            body: 'Take out the trash',
                            complete: false,
                        },
                        {
                            body: 'Mop the floor',
                            complete: false,
                        },
                        {
                            body: 'Do the dishes',
                            complete: true,
                        },
                    ]
                },

                {
                    week: 2,
                    chores: [
                        {
                            body: 'Take out the recycling',
                            complete: false,
                        },
                        {
                            body: 'Mop the floor',
                            complete: true,
                        },
                        {
                            body: 'Clean the refrigerator',
                            complete: true,
                        },
                    ]
                }
            ]            
        };

        return o;


    });

})();
;(function(){

    var choreIt = angular.module('choreIt');

    choreIt.controller('MainCtrl', ['chores', function(chores) {
        var self = this;

        self.weeks = chores.weeks;

        //default
        self.activeWeek = self.weeks[0];

        self.setActiveWeek = function(index) {
            self.activeWeek = self.weeks[index];
        }

        self.addChore = function() {
            self.activeWeek.chores.push({body: self.newChore, complete: false});
            self.newChore = '';
        }

        self.toggleComplete = function(chore) {
            chore.complete = !chore.complete;
        }
    }]);

})();
;(function() {
    var choreIt = angular.module('choreIt');

    choreIt.controller('NavCtrl', ['auth', function(auth) {
        var self = this;
        self.isLoggedIn = auth.isLoggedIn;
        self.currentUser = auth.currentUser;
        self.logOut = auth.logOut;
    }]);
})();