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
        
        
        var data_ngo = '{"name":"'+org_name+'","category":"'+org_type+'"}';
        
        $http.post('http://0.0.0.0:8000/api/v1/ngo', data_ngo, config)
        .success(function(data, status, header, config){
            if (data.auth){
                var ngo_id = data.ngo.id
            }else{
                var ngo_id = data.ngo
            }
            var data_user = '{"names":"'+fullname+'","email":"'+email+'","password":"'+password+'","ngo_id":"'+ngo_id+'"}';
            
            addUser(data_user);
            
        });
        
        function addUser(data_user){
            $http.post('http://0.0.0.0:8000/api/v1/user', data_user, config)
            .success(function(data, status, header, config){
                console.log(data);
                if (data.auth){
                    $location.path('/signin');
                }else{
                    $scope.message = data.message
                }
            });
        }
        
	}
	
}]);

myapp.controller('signinCtrl', ['$scope', '$http','$location', function($scope,$http,$location){
    $scope.message = false;
    $scope.sign_in = function(username, password){
        var config = {
			headers:{
				'Content-Type':'application/json'
			}
        }
         
        
        var data = '{"username":"'+username+'","password":"'+password+'"}';
        
        $http.post('http://0.0.0.0:8000/api/v1/login/', data, config)
        .success(function(data, status, header, config){
           console.log(data);
            if(data.auth == 1){
                var store_id = storeUser(data.user.id);
                $location.path('/');
            }else{
                $scope.message = true;
            }
        });
    }
    
}]);



function storeUser(User){
	localStorage.setItem('u___', User);
	return 1;
}


function restoreUserAsprin(){
	var user_id = localStorage.getItem('u___');
	return user_id;
}