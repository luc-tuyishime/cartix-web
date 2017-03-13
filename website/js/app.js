var webApp = angular.module('cartixWeb',['ngRoute']);

webApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl:'views/index.html',
        controller:'indexCtrl'
    })
    .when('/about',{
        templateUrl:'views/cartix.html',
        controller:'cartixCtrl'
    })
    .when('/community',{
        templateUrl:'views/community.html',
        controller:'communityCtrl'
    })
}]);

webApp.controller('indexCtrl',['$scope', function($scope){
              // Add scrollspy to <body>
              $('body').scrollspy({target: ".navbar", offset: 50});
              // make responsive on all screen
                $(".top-margin").css("margin-top", $(window).height()-650);
              $(".bg-1").css("height", function(index){
                  return $(window).height();
              })
              if ( $(window).width() > 500) {
                $("a").on('click', function(event) {
                  // Make sure this.hash has a value before overriding default behavior
                  if (this.hash !== "") {
                    // Prevent default anchor click behavior
                   // event.preventDefault();
                    // Store hash
                    var hash = this.hash;
                    // Using jQuery's animate() method to add smooth page scroll
                    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
                    $('html, body').animate({
                      scrollTop: $(hash).offset().top
                    }, 900, function(){
                      // Add hash (#) to URL when done scrolling (default click behavior)
                      window.location.hash = hash;
                    });
                  }  // End if
                });
              }
            //  window.onorientationchange = function() { location.reload() };
           
}]);

webApp.controller('cartixCtrl', ['$scope', function($scope){
    $('body').scrollspy({target: ".navbar", offset: 50});
           // make responsive on all screen
          $(".bg_01").css("margin-top", $(window).height()-950);
           $("").css("height", function(index){
               return $(window).height();
           })
            if ( $(window).width() > 500) {
           $("a").on('click', function(event) {
             // Make sure this.hash has a value before overriding default behavior
             if (this.hash !== "") {
               // Prevent default anchor click behavior
               //event.preventDefault();

               // Store hash
               var hash = this.hash;

               // Using jQuery's animate() method to add smooth page scroll
               // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
               $('html, body').animate({
                 scrollTop: $(hash).offset().top
               }, 900, function(){

                 // Add hash (#) to URL when done scrolling (default click behavior)
                 window.location.hash = hash;
               });
             }  // End if
           });
         }
            if ( $(window).width() > 500) {
           // Add smooth scrolling on all links inside the navbar
           $(".nav a").on('click', function(event) {
             // Make sure this.hash has a value before overriding default behavior
             if (this.hash !== "") {
               // Prevent default anchor click behavior
               event.preventDefault();

               // Store hash
               var hash = this.hash;

               // Using jQuery's animate() method to add smooth page scroll
               // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
               $('html, body').animate({
                 scrollTop: $(hash).offset().top
               }, 1000, function(){

                 // Add hash (#) to URL when done scrolling (default click behavior)
                 window.location.hash = hash;
               });
             }  // End if
           });
         }
            // hide collapse link after click
           $(document).on('click','.navbar-collapse.in',function(e) {
             if( $(e.target).is('a') ) {
                 $(this).collapse('hide');
             }
         });
}]);

webApp.controller('communityCtrl', ['$scope', function($scope){
    // Add scrollspy to <body>
           $('body').scrollspy({target: ".navbar", offset: 50});
           // make responsive on all screen
           $(".community-text_").css("margin-top", $(window).height()-900);
           $(".bg-001").css("height", function(index){
               return $(window).height();
           })
            if ( $(window).width() > 500) {
           $("a").on('click', function(event) {
             // Make sure this.hash has a value before overriding default behavior
             if (this.hash !== "") {
               // Prevent default anchor click behavior
               // Store hash
              // event.preventDefault();
               var hash = this.hash;
               // Using jQuery's animate() method to add smooth page scroll
               // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
               $('html, body').animate({
                 scrollTop: $(hash).offset().top
               }, 900, function(){
                 // Add hash (#) to URL when done scrolling (default click behavior)
                 window.location.hash = hash;
               });
             }  // End if
           });
         }
           // Add smooth scrolling on all links inside the navbar
           if ( $(window).width() > 500) {
           $(".nav a").on('click', function(event) {
             // Make sure this.hash has a value before overriding default behavior
             if (this.hash !== "") {
               // Prevent default anchor click behavior
               event.preventDefault();
               // Store hash
               var hash = this.hash;
               // Using jQuery's animate() method to add smooth page scroll
               // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
               $('html, body').animate({
                 scrollTop: $(hash).offset().top
               }, 1000, function(){
                 // Add hash (#) to URL when done scrolling (default click behavior)
                 window.location.hash = hash;
               });
             }  // End if
           });
         }

           $(document).on('click','.navbar-collapse.in',function(e) {
             if( $(e.target).is('a') ) {
                 $(this).collapse('hide');
             }
         });

         var scroll_start = 0;
            var startchange = $('#About');
            var offset = startchange.offset();
             if (startchange.length){
            $(document).scroll(function() {
               scroll_start = $(this).scrollTop();
               if(scroll_start > offset.top) {
                   $(".navvv").css('background-color','#87ad5d');
                } else {
                   $('.navvv').css('background-color', 'transparent');
                }
            });
           }
}]);
