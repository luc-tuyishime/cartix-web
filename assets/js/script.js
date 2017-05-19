/*Select box Script*/
$(function() {


    




    //Upload file

    function upload_file() {
        $("#upload_link").on('click', function(e) {
            e.preventDefault();
            $("#upload:hidden").trigger('click');
        });
    }




    $("#download_data").click(function(e) {
        event.preventDefault();
        $("#sidebar_data").hide();
        $("#saved").show();
    });




    /*SIdebar Script*/
    $(document).on('click', function(e) {
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



    
    // Build the chart

});