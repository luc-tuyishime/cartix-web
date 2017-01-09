
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

  $('#ddlCars5').multiselect({
      includeSelectAllOption: true
  });

  $('#ddlCars6').multiselect({
      includeSelectAllOption: true
  });

  $('#ddlCars7').multiselect({
      includeSelectAllOption: true
  });

  $('#ddlCars8').multiselect({
      includeSelectAllOption: true
  });

  $('#ddlCars9').multiselect({
      includeSelectAllOption: true
  });

  $('#ddlCars10').multiselect({
      includeSelectAllOption: true
  });

  $('#ddlCars11').multiselect({
      includeSelectAllOption: true
  });

  $('#ddlCars12').multiselect({
      includeSelectAllOption: true
  });

  $('#ddlCars13').multiselect({
      includeSelectAllOption: true
  });

  $('#ddlCars14').multiselect({
      includeSelectAllOption: true
  });

  $('#ddlCars15').multiselect({
      includeSelectAllOption: true
  });

  $('#ddlCars16').multiselect({
      includeSelectAllOption: true
  });

});




/*Hide and SHow Page*/
 $(document).ready(function(){
    $("#btn_cartix").click(function(e){
       event.preventDefault();
      $("#notification").hide();
       $("#second-container").show();
    });
 });
 $(document).ready(function(){
    $("#upload-progress").click(function(e){
         event.preventDefault();
        $("#second-container").hide();
         $("#third-container").show();
    });
 });
 $(document).ready(function(){
    $("#download-data").click(function(e){
         event.preventDefault();
         $("#sidebar_data").hide();
         $("#side-content-saved").show();
    });
 });



 //DropzoneJS snippet - js
 $(function(){
 $("#upload_link").on('click', function(e){
     e.preventDefault();
     $("#upload:hidden").trigger('click');
 });
 });


$(document).ready(function() {});

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
    document.getElementById("mySidenav1").style.width = "50%";
    document.body.style.backgroundColor = "#fff";
    document.getElementById("call-opacity").className = "opacity";
}

function closeNav_() {
    document.getElementById("mySidenav1").style.width = "0";
    document.body.style.backgroundColor = "#fff";
    document.getElementById("call-opacity").className = "";
}
