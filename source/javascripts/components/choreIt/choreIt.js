//States
;(function(){
    var choreIt = angular.module('choreIt', ['ui.router', 'util']);

    choreIt.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
            //basic home state, prompt users to register or login
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
                controllerAs: 'main',
                onEnter: ['auth', '$state', function(auth, $state) {
                    if(auth.isLoggedIn()) {
                        $state.go('chores');
                    }
                }]
            })
            //state for logging in returning users
            .state('home.login', {
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
            .state('home.register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthCtrl',
                controllerAs: 'auth',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if(auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })


            .state('chores', {
                url: '/chores',
                templateUrl: '/chores.html',
                controller: 'MainCtrl',
                controllerAs: 'main',
                resolve: {
                    groupPromise: ['chores', function(chores) {
                        return chores.getAllGroups();
                    }]
                },
                onEnter: ['auth', '$state', function(auth, $state) {
                    if(!auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]

            })
            // //state for logging in returning users
            // .state('login', {
            //     url: '/login',
            //     templateUrl: '/login.html',
            //     controller: 'AuthCtrl',
            //     controllerAs: 'auth',
            //     onEnter: ['$state', 'auth', function($state, auth) {
            //         if(auth.isLoggedIn()) {
            //             $state.go('home');
            //         }
            //     }] //add in when wiring to backend, check if already logged
            // })
            // //state for registering new users
            // .state('register', {
            //     url: '/register',
            //     templateUrl: '/register.html',
            //     controller: 'AuthCtrl',
            //     controllerAs: 'auth',
            //     onEnter: ['$state', 'auth', function($state, auth) {
            //         if(auth.isLoggedIn()) {
            //             $state.go('home');
            //         }
            //     }]
            // })
            ;

        $urlRouterProvider.otherwise('home');

    }]);
})();