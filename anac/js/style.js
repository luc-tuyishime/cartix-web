




/*Hide and SHow Page*/
 $(document).ready(function(){
    $("#button1").click(function(e){
       event.preventDefault();
      $("#formulaire1").hide();
       $("#formulaire2").show();
    });
 });
  $(document).ready(function(){
     $("#button2").click(function(e){
          event.preventDefault();
         $("#formulaire2").hide();
          $("#formulaire3").show();
     });

  });

  $(document).ready(function(){
     $("#button3").click(function(e){
          event.preventDefault();
         $("#formulaire3").hide();
          $("#formulaire4").show();
     });

  });

  $(document).ready(function(){
     $("#button4").click(function(e){
          event.preventDefault();
         $("#formulaire4").hide();
          $("#formulaire5").show();
     });

  });

  $(document).ready(function(){
     $("#button5").click(function(e){
          event.preventDefault();
         $("#formulaire5").hide();
          $("#formulaire6").show();
     });

  });
 // $(document).ready(function(){
 //    $("#download-data").click(function(e){
 //         event.preventDefault();
 //         $("#sidebar_data").hide();
 //         $("#side-content-saved").show();
 //    });
 // });
