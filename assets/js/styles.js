$('.collapse').on('shown.bs.collapse', function(){
$(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
}).on('hidden.bs.collapse', function(){
$(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
});

$('.option2').css({
    'height': $('.option2').height()
});

$(document).ready(function(){

  $("#personal-details").click(function(event){
     event.preventDefault();
     $(".professional-details").hide();
     $(".personal-details-hide").show();

  });

$("#professional-details").click(function(event){
   event.preventDefault();
   $(".personal-details-hide").hide();
   $(".professional-details").show();
});
$("#openform").click(function(event){
   event.preventDefault();
  $(".open-form").show();
 });


 var scroll_start = 0;
           var startchange = $('#saving');
           var offset = startchange.offset();
            if (startchange.length){
           $(document).scroll(function() {
              scroll_start = $(this).scrollTop();
              if(scroll_start > offset.top) {
                  $(".navvv").css('background-color','#fff');

               } else {
                  $('.navvv').css('background-color', 'transparent');

               }
            });
          }

});

$('.details-style2').on('click', function(){
    $('.details-style2').removeClass('selected');
    $(this).addClass('selected');
});

$(function() {
    $('p').click(function() {
        $('p').removeClass('underline');
        $(this).addClass('underline');
    });
});
