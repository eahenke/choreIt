;(function(){

    var choreIt = angular.module('choreIt');

    choreIt.controller('MainCtrl', ['$scope', 'chores', 'auth', function($scope, chores, auth) {
        var self = this;

        self.groups = chores.groups;

        //default
        if(self.groups) {
            self.activeGroup = self.groups[0];            
        }

        self.setActiveGroup = function(group) {
            self.activeGroup = group;
        }

        self.addChore = function() {
            // self.activeGroup.chores.push({body: self.newChore, complete: false});

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

        self.addGroup = function() {
            console.log(self.newGroup);
            if(!self.newGroup || self.newGroup == '') {
                return;
            } else {                
                var group = {};
                if(auth.isLoggedIn()) {
                    group.title = self.newGroup;
                    group.username = auth.currentUser();
                    chores.addGroup(group);

                    // //reassign active group
                    // if(!self.activeGroup) {
                    //     self.activeGroup = group;
                    // }

                    assignActiveGroup('add', group);

                    self.newGroup = '';

                } else {
                    console.log('You must be logged in to add a group');
                    //add more later - force state change to login?
                    //no, just a link
                }
            }
        };

        self.deleteGroup = function(group) {
            // console.dir(self.groups.indexOf(group));
            chores.deleteGroup(group._id).then(function() {
                //update local copy
                console.dir(self.groups.indexOf(group));
                self.groups.splice(self.groups.indexOf(group), 1);
                
                // //reassign active group
                // if(group == self.activeGroup) {
                //     if(self.groups.length) {
                //         self.activeGroup = self.groups[self.groups.length -1];
                //     } else {
                //         self.activeGroup = null;                        
                //     }
                // }

                assignActiveGroup('delete', group);
            });
        };

        self.deleteChore = function(chore) {
            var group = self.activeGroup;
            chores.deleteChore(group._id, chore._id).then(function() {
                group.chores.splice(group.chores.indexOf(chore), 1);
            });
        };

        function assignActiveGroup(action, group) {
            if(action == 'delete') {
               //reassign active group
                if(group == self.activeGroup) {
                    if(self.groups.length) {
                        self.activeGroup = self.groups[self.groups.length -1];
                    } else {
                        self.activeGroup = null;                        
                    }
                } 
            } else if(action == 'add') {
                //reassign active group
                if(!self.activeGroup) {
                    self.activeGroup = group;
                }                
            }
        }
        
    }]);

})();