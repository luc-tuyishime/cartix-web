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
	$scope.user = true;
    $scope.organization = false
    
    $scope.nextOrg = function(fullname, email, password){
        $scope.user = false;
        $scope.organization = true;
        $scope.fullname = fullname;
        $scope.email = email;
        $scope.password = password;
    }
    
	$scope.sign_up = function(fullname, email, password, org_name, org_type){
        console.log(Array(fullname, email, password, org_name, org_type));
        var config = {
			headers:{
				'Content-Type':'application/json'
			}
		}
        
        var data = '{"names":"'+fullname+'","email":"'+email+'","password":"'+password+'","name":"'+org_name+'","category":"'+org_type+'"}';
        
        
        
        
	}
	
}]);