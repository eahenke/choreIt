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