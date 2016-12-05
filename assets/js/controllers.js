var myapp = angular.module('cartixApp', ['ngRoute']);

myapp.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'views/sign/sign-in.html'
    })
    .when('/signin', {
        templateUrl: 'views/sign/sign-in.html'
    })
    .when('/signup', {
        templateUrl: 'views/sign/sign-up.html'
    })
    .when('/organisation', {
        templateUrl: 'views/sign/organisation.html'
    })
    .when('/new-password', {
        templateUrl: 'views/sign/pwd-recovery.html'
    })
    .when('/forget-password', {
        templateUrl:'views/sign/recovery.html'
    })
    .otherwise({
        redirectTo: '/'    
    })
}]);

myapp.controller('signupCtrl',['$scope','$http','$location', function($scope,$http,$location){
	
	$scope.singup =  function(fullname, email, password){
	   console.log(Array(fullname, email, password));	
	}
	
}]);