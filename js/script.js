$("document").ready(function(){
    $("#search").hover(function(e){

        setTimeout(function(){
            $("#search").attr("placeholder","Search");
        },300);
    }, function(e){
         $("#search").attr("placeholder","");
    });
});


// $(document).ready(function(){
//   $("button #open-side").click(function(e){
//     event.preventDefault();
//      alert("dfjkdjfklsfjsdkfs");
//     // $("#mySidenav").hide();
//     // $("#mySidenav_").show();
//   });
