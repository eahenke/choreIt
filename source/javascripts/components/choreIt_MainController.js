;(function(){

    var choreIt = angular.module('choreIt');

    //Controller for main chores section
    choreIt.controller('MainCtrl', ['$scope', 'chores', 'auth', function($scope, chores, auth) {
        var self = this;

        self.groups = chores.groups;

        //default - change later to save last active group to user in db for persistence
        if(self.groups) {
            self.activeGroup = self.groups[0];            
        }

        //Group methods

        //sets the active group to display
        self.setActiveGroup = function(group) {
            self.activeGroup = group;
        };

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

        //Chore Methods

        //calls chores service add chores to the currently active group
        self.addChore = function() {           
            var id = self.activeGroup._id;
            chores.addChore(id, {body: self.newChore}).then(function(response) {
                //update local copy to reflect changes
                self.activeGroup.chores.push(response.data);
            });
            self.newChore = '';
        };

        //calls chore service to toggle the 'complete' property of a chore
        self.toggleComplete = function(chore) {
            var group = self.activeGroup;
            chores.toggleComplete(group._id, chore._id).then(function(response) {
                //update local version
                chore.complete = !chore.complete;
            }, function(error) {
                console.dir(error);
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

        //Sets a chore into edit mode, enabling editing of text body
        self.setChoreEditMode = function(chore) {
            var group = self.activeGroup;

            //allow editing only one at a time
            group.chores.forEach(function(otherChore) {
                otherChore.editMode = false;
            });

            chore.editMode = true;
        };

        //call chore service to edit chore text
        //currently activated on input blur, consider adding 'save' button?
        self.editChore = function(chore) {
            var group = self.activeGroup;

            //must have content
            if(chore.editText != '' && chore.editText) {
                //call chore service to save to db
                chores.editChore(group._id, chore._id, {newBody: chore.editText}).then(function() {
                    //update local copy and end edit mode
                    chore.body = chore.editText;
                    chore.editText = '';
                    chore.editMode = false;
                }, function(error) {
                    //add better error handling later
                    console.dir(error);
                });            
            } else {
                //no content, end edit mode
                chore.editMode = false;
            }
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