myapp.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'views/sign/sign-in.html',
        controller: 'loginBgCtrl'
    })
    .when('/signin', {
        templateUrl: 'views/sign/sign-in.html',
        controller: 'loginBgCtrl'
    })
    .when('/signup', {
        templateUrl: 'views/sign/sign-up.html',
        controller: 'loginBgCtrl'
    })
    .when('/organisation', {
        templateUrl: 'views/sign/organisation.html',
        controller: 'loginBgCtrl'
    })
    .when('/new-password', {
        templateUrl: 'views/sign/pwd-recovery.html',
        controller: 'loginBgCtrl'
    })
    .when('/app/',{
        templateUrl: 'views/cartix/index.html',
        controller: 'appBgCtrl'
    })
    .when('/forget-password', {
        templateUrl:'views/sign/recovery.html' ,
        controller: 'loginBgCtrl'
    })
    .otherwise({
        redirectTo: '/'    
    })
}]);


myapp.controller('appBgCtrl', ['$scope', function($scope){
    $("body").removeClass('body-login');
    $("body").addClass('body-app');
}]);
myapp.controller('loginBgCtrl', ['$scope', function($scope){
    $("body").removeClass('body-app');
    $("body").addClass('body-login');
}]);