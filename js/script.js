$("#search").hover(function(e){
        
        setTimeout(function(){
            $("#search").attr("placeholder","Search");
        },300);
    }, function(e){
         $("#search").attr("placeholder","");
    });