/*Hide and SHow Page*/
 $(document).ready(function(){
    $("#button-save").click(function(e){
         event.preventDefault();
        $("#side-content-data").hide();
         $("#side-content-saved").show();
    });
 });

 // $(document).ready(function(){
 //    $("#button-save").click(function(e){
 //         event.preventDefault();
 //        $("#side-content-data").hide();
 //         $("#side-content-saved").show();
 //    });
 // });
 //
 // $(document).ready(function(){
 //    $("#button-save-file").click(function(e){
 //         event.preventDefault();
 //        $("#side-upload-complete").hide();
 //         $("#side-content-data").show();
 //    });
 // });



/*SIdebar Script*/
$(document).on('click', function (e) {
    var target = $(e.target).closest(".btn-select");
    if (!target.length) {
        $(".btn-select").removeClass("active").find("ul").hide();
    }
});

