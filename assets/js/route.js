var myapp = angular.module("cartixApp", [
  "ngRoute",
  "ngFileUpload",
  "ngCookies",
  "ngIdle",
]);
myapp.config([
  "$routeProvider",
  "$locationProvider",
  function ($routeProvider, $locationProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/cartix/index.html",
        controller: "loginBgCtrl",
        data: {
          private: false,
        },
      })
      .when("/signin", {
        templateUrl: "views/sign_/sign-in.html",
        controller: "signinCtrl",
        data: {
          private: false,
        },
      })
      .when("/signup", {
        templateUrl: "views/sign_/sign-up.html",
        controller: "loginBgCtrl",
        data: {
          private: false,
        },
      })
      .when("/validate-otp-code", {
        templateUrl: "views/sign_/enter-otp.html",
        controller: "validateOtpCtrl",
        data: {
          private: false,
        },
      })
      .when("/reset-password/:token/:email", {
        templateUrl: "views/sign_/recovery-pass.html",
        controller: "resetPasswordCtrl",
        data: {
          private: false,
        },
      })
      .when("/organisation", {
        templateUrl: "views/sign/organisation.html",
        controller: "loginBgCtrl",
        data: {
          private: false,
        },
      })
      .when("/new-password", {
        templateUrl: "views/sign/pwd-recovery.html",
        controller: "loginBgCtrl",
        data: {
          private: false,
        },
      })
      .when("/app/", {
        templateUrl: "views/cartix/index.html",
        controller: "excelFileCtrl",
        data: {
          private: true,
        },
      })
      .when("/forget-password", {
        templateUrl: "views/sign_/recovery.html",
        controller: "loginBgCtrl",
        data: {
          private: false,
        },
      })
      .when("/logout", {
        controller: "logoutController",
        data: {
          private: true,
        },
      })
      .when("/recover/:email/:keyu", {
        template: "",
        controller: "keyController",
        data: {
          private: false,
        },
      });

    // use the HTML5 History API
    //$locationProvider.html5Mode(true);
  },
]);

myapp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    if (!AuthService.getUserStatus()) {
      if (next.data.private && !AuthService.isLoggedIn()) {
        $location.path("/");
        $route.reload();
      }
    }
  });
});

myapp.config([
  "KeepaliveProvider",
  "IdleProvider",
  function (KeepaliveProvider, IdleProvider) {
    IdleProvider.idle(10 * 60);
    IdleProvider.timeout(5);
    KeepaliveProvider.interval(10);
  },
]);

myapp.run(function ($rootScope, Idle, AuthService, $location) {
  Idle.watch();
  $rootScope.$on("IdleTimeout", function () {
    // end their session and redirect to login.
    console.log(
      "I am logging the user out here and checking if everythign si working"
    );
    AuthService.logout().then(function () {
      $location.path("/signin");
      localStorage.clear();
    });
  });
});
