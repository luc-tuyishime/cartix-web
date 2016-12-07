var myapp = angular.module('cartixApp', ['ngRoute','ngFileUpload']);

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
    .when('/app/',{
        templateUrl: 'views/cartix/index.html'
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
                $location.path('/app/');
                $("#change-bg").removeClass('body-login');
                $("#change-bg").addClass('body-app');
            }else{
                $scope.message = true;
            }
        });
    }
    
}]);



myapp.controller('excelFileCtrl', ['$scope', 'Upload', '$timeout','$window','$http','$location', function ($scope, Upload, $timeout, $window, $http, $location) {
    
    $scope.box_data_one = true;
    $scope.box_data_two = false;
    
	$scope.upload_File = function(file) {
		file.upload = Upload.upload({
			url: 'http://0.0.0.0:8000/api/upload/',
			data: {file: file},
		});

		file.upload.then(function (response) {
			$timeout(function () {
				console.log(response.data);
                if(!response.data.status){
                    postFailFile(response.data.originalpath, response.data.savepath, response.data.filename)
                    $scope.box_data_one = false;
                    $scope.box_data_two = true;
                    $scope.savepath = response.data.savepath;
                    $scope.filename = response.data.filename;
                }else{
                    storeJson = storeJson(response.data);
                    closeNav();
                    openNav1();
                    
                }
			});
		}, function (response) {
			if (response.status > 0)
				$scope.errorMsg = response.status + ': ' + response.data;
		}, function (evt,response) {
				// Math.min is to fix IE which reports 200% sometimes
				file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				if(file.progress == 100){
                    
				}
			});
		}
    
    function postFailFile(original, save, filename){
        var id = restoreUser();
        var config = {
			headers:{
				'Content-Type':'application/json'
			}
        }
        
        var data = '{"original":"'+original+'","save":"'+save+'","user_id":"'+id+'","filename":"'+filename+'"}';
    
        $http.post('http://0.0.0.0:8000/api/v1/file/save/', data, config)
        .success(function(data, status, header, config){
            console.log(data);
        })
    }
}]);








function storeUser(User){
	localStorage.setItem('u___', User);
	return 1;
}

function storeJson(json){
    localStorage.setItem('j___', json);
}


function restoreUser(){
	var user_id = localStorage.getItem('u___');
	return user_id;
}



function openNav() {
    document.getElementById("mySidenav").style.width = "50%";
    document.body.style.backgroundColor = "#fff";
    document.getElementById("call-opacity").className = "opacity";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.body.style.backgroundColor = "white";
    document.getElementById("call-opacity").className = "";
}

function openNav1() {
    document.getElementById("mySidenav1").style.width = "50%";
    document.body.style.backgroundColor = "#fff";
    document.getElementById("call-opacity").className = "opacity";
}

function closeNav_() {
    document.getElementById("mySidenav1").style.width = "0";
    document.body.style.backgroundColor = "#fff";
    document.getElementById("call-opacity").className = "opacity";
}

