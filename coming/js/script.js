$("document").ready(function(){
    var i =0;
   setInterval(function(){
       $("#cartix_shape").css({'transform': 'rotate('+i+'deg)'});
       i+=2;
   },100);
    
});