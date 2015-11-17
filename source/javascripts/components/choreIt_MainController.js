;(function(){

    var choreIt = angular.module('choreIt');

    choreIt.controller('MainCtrl', ['chores', 'auth', function(chores, auth) {
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
                    self.newGroup = '';

                } else {
                    console.log('You must be logged in to add a group');
                    //add more later - force state change to login?
                    //no, just a link
                }
            }
        }        
        
    }]);

})();