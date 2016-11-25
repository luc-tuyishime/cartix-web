$("document").ready(function(){
    var i =0;
    var x =0;
    
    var bgcolor = ['#001F3F','#3D9970','#6b4f63','#85144B','#AAAAAA','#111111']
    var ran = Math.floor((Math.random() * bgcolor.length) + 1);
    
    $("body").css({'background-color': bgcolor[ran]});
    
   setInterval(function(){
       $("#cartix_shape").css({'transform': 'rotate('+i+'deg)'});
       i+=1;
       if(i % 180 == 0){
            x +=1;
            $("body").css({'background-color': bgcolor[x]});
            if(x == bgcolor.length){
                x = 0;
            }
       }
   },100);
    
    
   
    
    
    
});
    
    
    
  

