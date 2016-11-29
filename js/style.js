$(document).ready(function() {
       $('#example-post').multiselect({
           includeSelectAllOption: true,
           enableFiltering: true
       });
   });


$(document).on('click', '.btn-select', function (e) {
    e.preventDefault();
    var ul = $(this).find("ul");
    if ($(this).hasClass("active")) {
        if (ul.find("li").is(e.target)) {
            var target = $(e.target);
            target.addClass("selected").siblings().removeClass("selected");
            var value = target.html();
            $(this).find(".btn-select-input").val(value);
            $(this).find(".btn-select-value").html(value);
        }
        ul.hide();
        $(this).removeClass("active");
    }
    else {
        $('.btn-select').not(this).each(function () {
            $(this).removeClass("active").find("ul").hide();
        });
        ul.slideDown(300);
        $(this).addClass("active");
    }
});

$(document).on('click', function (e) {
    var target = $(e.target).closest(".btn-select");
    if (!target.length) {
        $(".btn-select").removeClass("active").find("ul").hide();
    }
});
             /* settings date*/

             $(document).ready(function(){
         $("   ").click(function(){
             $(this).hide();
         });
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
    document.getElementById("mySidenav_").style.width = "900px";
    document.body.style.backgroundColor = "#fff";
    document.getElementById("call-opacity").className = "opacity";
}

function closeNav_() {
    document.getElementById("mySidenav_").style.width = "0";
    document.body.style.backgroundColor = "white";
    document.getElementById("call-opacity").className = "";
}


<!-- Initialize the plugin: -->

$(document).ready(function() {
     $('#example-selectAllNumber').multiselect({
         includeSelectAllOption: true,
         selectAllNumber: false
     });
 });

 <!--select button-->

 $(document).ready(function () {
     $(".btn-select").each(function (e) {
         var value = $(this).find("ul li.selected").html();
         if (value != undefined) {
             $(this).find(".btn-select-input").val(value);
             $(this).find(".btn-select-value").html(value);
         }
     });
 });

 $(function() {

    $('#my-select').multiselect({
        includeSelectAllOption: true
    });

    // $("#my-multi-select").multiselect('selectAll', false);
    // $("#my-multi-select").multiselect('updateButtonText');

});

$('.ui.sidebar')
  .sidebar('toggle')
;
