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
                // resolve: {
                //     groupPromise: ['chores', function(chores) {
                //         return chores.getAllGroups();
                //     }]
                // },
                onEnter: ['auth', '$state', function(auth, $state) {
                    if(auth.isLoggedIn()) {
                        $state.go('chores');
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
;(function(){
    var choreIt = angular.module('choreIt');

    choreIt.factory('chores', ['$http', 'auth', function($http, auth) {
        var o = {
            groups: [],
        };

        o.getAllGroups = function() {
            return $http.get('/groups', {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).then(function(response) {
                angular.copy(response.data, o.groups);
            });
        };

        o.addGroup = function(group) {
            return $http.post('/groups', group, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).then(function(response) {
                
                o.groups.push(response.data);
                return response;
            });
        };

        o.deleteGroup = function(id) {
            return $http.delete('/groups/' + id, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            });
        };

        o.addChore = function(id, chore) {
            return $http.post('/groups/' + id + '/chore', chore, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            });
        };

        o.deleteChore = function(groupId, choreId) {
            return $http.delete('/groups/' + groupId + '/chores/' + choreId, {
               headers: {Authorization: 'Bearer ' + auth.getToken()} 
            });
        }


        return o;


    }]);

})();
;(function(){

    var choreIt = angular.module('choreIt');

    //Controller for main chores section
    choreIt.controller('MainCtrl', ['$scope', 'chores', 'auth', function($scope, chores, auth) {
        var self = this;

        self.groups = chores.groups;

        //default
        if(self.groups) {
            self.activeGroup = self.groups[0];            
        }

        //sets the active group to display
        self.setActiveGroup = function(group) {
            self.activeGroup = group;
        }

        //calls chores service add chores to the currently active group
        self.addChore = function() {           
            var id = self.activeGroup._id;
            chores.addChore(id, {body: self.newChore}).then(function(response) {
                //update local copy to reflect changes
                self.activeGroup.chores.push(response.data);
            });
            self.newChore = '';
        }

        self.toggleComplete = function(chore) {
            chore.complete = !chore.complete;
        }

        //calls chores service to add group
        self.addGroup = function() {
            //must have content
            if(!self.newGroup || self.newGroup == '') {
                return;
            } else {                
                var group = {};
                //Must be logged in to add
                if(auth.isLoggedIn()) {
                    group.title = self.newGroup;
                    group.username = auth.currentUser();
                    //add the group
                    chores.addGroup(group).then(function(response) {
                        reassignActiveGroup('add', response.data);
                    });
                    

                    self.newGroup = '';

                } else {
                    console.log('You must be logged in to add a group');
                    //add more later - force state change to login?
                    //no, just a link
                }
            }
        };

        //Calls chore service to delete groups
        self.deleteGroup = function(group) {
            
            chores.deleteGroup(group._id).then(function() {
                //update local copy
                self.groups.splice(self.groups.indexOf(group), 1);
                
                //assign new active group
                reassignActiveGroup('delete', group);
            });
        };

        //Calls chore service to delete chores
        self.deleteChore = function(chore) {
            var group = self.activeGroup;
            chores.deleteChore(group._id, chore._id).then(function() {
                //update local copy
                group.chores.splice(group.chores.indexOf(chore), 1);
            });
        };

        //based on action taken, assigns a new active group (first group, or activeGroup deleted)
        function reassignActiveGroup(action, group) {

            if(action == 'delete') {
               //if deleted current group
                if(group == self.activeGroup) {
                    if(self.groups.length) {
                        //make final remaining group active
                        self.activeGroup = self.groups[self.groups.length -1];
                    } else {
                        //all groups gone
                        self.activeGroup = null;                        
                    }
                } 
            } else if(action == 'add') {

                //no current groups
                if(!self.activeGroup) {
                    self.activeGroup = group;
                }                
            }
        }
        
    }]);

})();
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