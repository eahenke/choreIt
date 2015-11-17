;(function(){
    var choreIt = angular.module('choreIt');

    choreIt.factory('chores', ['$http', 'auth', function($http, auth) {
        var o = {
            groups: [],
        };
            //dummy data
        //     weeks: [
        //         {
        //             week: 1,
        //             chores: [
        //                 {
        //                     body: 'Take out the trash',
        //                     complete: false,
        //                 },
        //                 {
        //                     body: 'Mop the floor',
        //                     complete: false,
        //                 },
        //                 {
        //                     body: 'Do the dishes',
        //                     complete: true,
        //                 },
        //             ]
        //         },

        //         {
        //             week: 2,
        //             chores: [
        //                 {
        //                     body: 'Take out the recycling',
        //                     complete: false,
        //                 },
        //                 {
        //                     body: 'Mop the floor',
        //                     complete: true,
        //                 },
        //                 {
        //                     body: 'Clean the refrigerator',
        //                     complete: true,
        //                 },
        //             ]
        //         }
        //     ]            
        // };

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
            });
        };

        o.addChore = function(id, chore) {
            return $http.post('/groups/' + id + '/chore', chore, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            });
        }



        return o;


    }]);

})();