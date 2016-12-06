
/*Select box Script*/
$(function () {
  $('#ddlCars2').multiselect({
      includeSelectAllOption: true
  });

  $('#ddlCars3').multiselect({
      includeSelectAllOption: true
  });

  $('#ddlCars4').multiselect({
      includeSelectAllOption: true
  });

});


/*Hide and SHow Page*/
// $(document).ready(function(){
//    $("#open-side").click(function(e){
//         event.preventDefault();
//        $("#side-content-upload").hide();
//         $("#side-upload-complete").show();
//    });
// });
//
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
    document.getElementById("mySidenav").style.width = "50%";
    document.body.style.backgroundColor = "#fff";
    document.getElementById("call-opacity").className = "opacity";
}

function closeNav_() {
    document.getElementById("mySidenav").style.width = "0";
    document.body.style.backgroundColor = "white";
    document.getElementById("call-opacity").className = "";
}
