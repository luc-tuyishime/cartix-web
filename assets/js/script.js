/*Select box Script*/
$(function () {

  $('#ddlCars01').multiselect({
      includeSelectAllOption: true

  });
  $('#ddlCars02').multiselect({
      includeSelectAllOption: true
  });
  $('#ddlCars03').multiselect({
      includeSelectAllOption: true
  });
  $('#ddlCars04').multiselect({
      includeSelectAllOption: true
  });

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

       $("#upload-progress").click(function(e){
            event.preventDefault();
           $("#second-container").hide();
            $("#third-container").show();
       });

    });
    $("#download-data_").click(function(e){
         event.preventDefault();
        $("#sidebar_data").hide();
         $("#saved").show();
    });
 });

 //Upload file
 $(function(){
 $("#upload_link").on('click', function(e){
     e.preventDefault();
     $("#upload:hidden").trigger('click');
 });
 });


// $(document).ready(function() {});
//
//   $(document).ready(function(){
//      $("#button-save").click(function(e){
//          event.preventDefault();
//          $("#side-content-data").hide();
//           $("#side-content-saved").show();
//      });
//   });
//
//   $(document).ready(function(){
//      $("#button-save-file").click(function(e){
//           event.preventDefault();
//          $("#side-upload-complete").hide();
//           $("#side-content-data").show();
//      });
//   });



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


$(function () {

    $(document).ready(function () {

        // Build the chart
        Highcharts.chart('container', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Browser market shares January, 2015 to May, 2015'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: 'Microsoft Internet Explorer',
                    y: 56.33
                }, {
                    name: 'Chrome',
                    y: 24.03,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Firefox',
                    y: 10.38
                }, {
                    name: 'Safari',
                    y: 4.77
                }, {
                    name: 'Opera',
                    y: 0.91
                }, {
                    name: 'Proprietary or Undetectable',
                    y: 0.2
                }]
            }]
        });
    });
});