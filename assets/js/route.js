var myapp = angular.module('cartixApp', ['ngRoute','ngFileUpload']);
myapp.config(['$routeProvider', '$locationProvider' ,function($routeProvider, $locationProvider){
    
    
    
    $routeProvider
    .when('/', {
        templateUrl: 'views/sign/sign-in.html',
        controller: 'loginBgCtrl',
        data: {
            private: false
        }
    })
    .when('/signin', {
        templateUrl: 'views/sign/sign-in.html',
        controller: 'signinCtrl',
        data: {
            private: false
        }
    })
    .when('/signup', {
        templateUrl: 'views/sign/sign-up.html',
        controller: 'loginBgCtrl',
        data: {
            private: false
        }
    })
    .when('/organisation', {
        templateUrl: 'views/sign/organisation.html',
        controller: 'loginBgCtrl',
        data: {
            private: false
        }
    })
    .when('/new-password', {
        templateUrl: 'views/sign/pwd-recovery.html',
        controller: 'loginBgCtrl',
        data: {
            private: false
        }
    })
    .when('/app/',{
        templateUrl: 'views/cartix/index.html',
        controller: 'excelFileCtrl',
        data: {
            private: true
        }
    })
    .when('/forget-password', {
        templateUrl:'views/sign/recovery.html' ,
        controller: 'loginBgCtrl',
        data: {
            private: false
        }
    })
    .when('/logout', {
      controller: 'logoutController',
      data: {
            private: true
      }
    })
    .when('/recover/:email/:keyu', {
        template: '',
        controller: 'keyController',
        data: {
            private: false
        }
    })
    .when('/new-password/:email',{
        templateUrl: 'views/sign/recovery-pass.html',
        data: {
            private: false
        }
    })
    .otherwise({
        redirectTo: '/'    
    });
    
    
}]);






myapp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
        if(!AuthService.getUserStatus()){
            if (next.data.private && !AuthService.isLoggedIn()){
              $location.path('/');
              $route.reload();
            }
        }
        
      
  });
});


