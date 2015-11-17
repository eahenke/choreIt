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