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
                onEnter: [] //add in when wiring to backend, check if already logged
            })
            //state for registering new users
            .state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthCtrl',
                controllerAs: 'auth',
                onEnter: [] //add in when wiring to backend, check if already logged
            });

        $urlRouterProvider.otherwise('home');

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