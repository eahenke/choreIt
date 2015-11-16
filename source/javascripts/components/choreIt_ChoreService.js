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