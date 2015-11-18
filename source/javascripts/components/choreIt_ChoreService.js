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
        };

        o.toggleComplete = function(groupId, choreId) {
            console.log('let\'s toggle');
            return $http.put('/groups/' + groupId + '/chores/' + choreId + '/completed', {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            });
        };

        o.editChore = function(groupId, choreId, newBody) {
            return $http.put('/groups/' + groupId + '/chores/' + choreId + '/edit', newBody, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}  
            });
        }


        return o;


    }]);

})();