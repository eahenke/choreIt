;(function(){
    var util = angular.module('util');

    //directive to give focus to element when its ng-show is triggered
    util.directive('focusOnShow', function($timeout) {
        return {
            link: function(scope, element, attrs) {            
                scope.$watch(attrs.ngShow, function(val) {
                    //timeout required to render
                    $timeout(function() {
                        val ? element[0].focus() : element[0].blur();
                    });
                });
            }
        };
    });
})();