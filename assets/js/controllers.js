myapp.controller('appBgCtrl', ['$scope', function($scope) {
//    $("body").removeClass('body-login');
//    $("body").addClass('body-app');
}]);

myapp.controller('loginBgCtrl', ['$scope', '$location', function($scope, $location) {
    console.log($location.path());
}]);



myapp.controller('signupCtrl', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
    $scope.message = false;
    $scope.sign_up = function(fullname, email, password, org_name, org_type) {
        
        
        $scope.error = false;
        $scope.disable = true;
        var status = false;

        // call register service
       AuthService.registerNgo(org_name, org_type)
            // handle success
            .then(function() {
                $scope.disabled = false;
                status = true;

                var ngo_id = AuthService.getNgo();
                AuthService.registerUser(fullname, email, password, ngo_id)
                    // handle success
                    .then(function() {
                        $location.path('/signin');
                    })
                    // handle error
                    .catch(function() {
                        console.log(ngo_id);
                        $scope.message = true;
                    });
            })
            // handle error
            .catch(function() {
                $scope.disabled = true;
            }); 

    }

}]);




myapp.controller('signinCtrl', ['$scope', '$http', '$location', 'AuthService', function($scope, $http, $location, AuthService) {
    $(window).resize(function(){
        if($( window ).width() < 850){
            $("main").hide();
            $("body").text("Bigger Screen greather than 750px");
        }
    });
    
    
    $scope.message = false;
    
    
    // Signup
    
      var url = 'https://sgapi.bnr.rw/api/v1/params/1';

        $http.get(url)
            .success(function(data, status, header, config) {
                console.log(data);
                $scope.name = data.user.names;
                $scope.email = data.user.email;
                if(data.user.user_role=="1"){
                    $scope.parameters = true;
                    user_params(data.upload, data.signup);
                }else{
                    $scope.parameters = false;
                }
            }).error(function(data, status, header, config) {

            });
    
    function user_params(upload, signup){
        console.log(upload, signup);
        
        if (upload){
            $("#u_activate").attr("checked", "checked");
            $scope.upload_show = true;
            
        }else{
            $("#u_deactivate").attr("checked", "checked");
            $scope.upload_show = false;
        }
        
        if (signup){
            $("#s_activate").attr("checked", "checked");
            $scope.signup_show = true
        }else{
            $("#s_deactivate").attr("checked", "checked");
            $scope.signup_show = false;

        }
    }
    
    
    // Sigin
    
    

    AuthService.destroyUser();

    $scope.sign_in = function(username, password) {
        var data = '{"username":"' + username + '","password":"' + password + '"}';

        AuthService.login(data)
            .then(function() {
                $location.path('/app');
            })
            .catch(function() {
                $scope.message = true;

            });
    }

}]);


myapp.controller('keyController', ['$scope', '$http', '$location', '$routeParams', 'AuthService', function($scope, $http, $location, $routeParams, AuthService) {
    console.log($routeParams.email, $routeParams.keyu);
    AuthService.Key($routeParams.email, $routeParams.keyu)
        .then(function() {
            console.log("edddee");
            var link = "/new-password/" + $routeParams.email;
            $location.path(link);
        })
        .catch(function() {
            $location.path('/signin');
        });
}]);


myapp.controller('changePasswordCtrl', ['$scope', '$http', '$location', '$routeParams', 'AuthService', function($scope, $http, $location, $routeParams, AuthService) {
    $scope.message = false;
    $scope.changePass = function(password, cpassword) {
        if (password != cpassword) {
            $scope.message = true;
        } else {
            AuthService.changePassword(password, $routeParams.email)
                .then(function() {
                    $location.path('/signin');
                })
                .catch(function() {
                    $scope.message = true;
                })
        }
    }
}]);


myapp.controller('forgetCtrl', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
    $scope.notValid = false;
    $scope.valid = false;
    $scope.recoverPass = function(email) {
        console.log(email);
        AuthService.recover(email)
            .then(function() {
                $scope.valid = true;
            })
            .catch(function() {
                $scope.notValid = true;
            })
    }
}]);


myapp.controller('excelFileCtrl', ['$scope', 'Upload', '$timeout', '$window', '$http', '$location', 'AuthService', function($scope, Upload, $timeout, $window, $http, $location, AuthService) {
    $("body").removeClass('body-login');
    $("body").addClass('body-app');

    $('#upload_link').click(function(e) {
        e.preventDefault();
        $("#upload").trigger("click");
        
    });


    var ngo_id = restoreNgo();
    var url = "https://sgapi.bnr.rw/api/v1/ngo/" + ngo_id;

    $http.get(url).success(function(data, status, header, config) {
            $scope.ngo_name = data.ngo.name;
        })
        .error(function(data, status, header, config) {

        });



    $scope.logout = function() {
        // call logout from service

        AuthService.logout()
            .then(function() {
                $location.path('/signin');
            });

    };


    $scope.viewData = false;

    $scope.uploadInput = true;
    $scope.img_upl = true;
    $scope.uploadTitle = "Submit Your File";
    $scope.box_data_one = true;
    $scope.box_data_two = false;
    $scope.spinLoad = false;
    $scope.uploadProcess = true;
    $scope.showDataUlploaded = false;
    $scope.successfullySaved = false;

    //$scope.sg_number = 100;



    $scope.upload_File = function(file) {
        file.upload = Upload.upload({
            url: 'https://sgapi.bnr.rw/api/upload/',
            data: {
                file: file
            },
        });

        file.upload.then(function(response) {
            $timeout(function() {
                $scope.spinLoad = false;
                $scope.uploadInput = true;
                if (!response.data.status) {
                    postFailFile(response.data.originalpath, response.data.savepath, response.data.filename)
                    $scope.box_data_one = false;
                    $scope.box_data_two = true;
                    $scope.uploadTitle = "File error !";
                    $scope.uploadInput = true;
                    $scope.img_upl = false;
                    $scope.savepath = response.data.savepath;
                    $scope.filename = response.data.filename;
                } else {
                    $scope.uploadProcess = false;
                    $scope.showDataUlploaded = true;
                    renderView(response.data);
                    $scope.originalpath = response.data.originalpath;
                    $scope.filename_save = response.data.filename;
                }
            });
        }, function(response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function(evt, response) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            if (file.progress == 100) {
                file.progress = -1;
                $scope.spinLoad = true;
                $scope.img_upl = false;
                $scope.uploadTitle = "Checking for errors";
                $scope.box_data_one = false;
                $scope.uploadInput = false;
            }
        });
    }

    function postFailFile(original, save, filename) {
        var id = restoreUser();
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        var data = '{"original":"' + original + '","saved":"' + save + '","user_id":"' + id + '","filename":"' + filename + '"}';

        $http.post('https://sgapi.bnr.rw/api/v1/file/save/', data, config)
            .success(function(data, status, header, config) {
                console.log(data);
            });
    }


    function renderView(data) {
        if (data.json.length == 1) {

        } else {
            console.log(data.json);
            multipleDataView(data.json);
        }
    }


    function multipleDataView(json_data) {
        $scope.savedValue = "Save";
        var year = [],
            member = [],
            female = [],
            male = [],
            ngo = [],
            partner = [],
            saved = [],
            loan = [],
            sg = [],
            status = [],
            location = [],
            year_amount;

        $.each(json_data, function(key, value) {
            item = [];
            item.push(value['province'], value['district'], value['sector']);
            location.push(item);
            ngo.push(value['international_ngo']);
            partner.push(value['local_ngo']);
            if (value['saved_amount'] != 'N/A') {
                saved.push(parseInt(value['saved_amount']));
            }
            if (value['outstanding_loans'] != 'N/A') {
                loan.push(parseInt(value['outstanding_loans']));
            }
            sg.push(value['saving_group_name']);
            female.push(parseInt(value['sgs_members__female']));
            male.push(parseInt(value['sgs_members__male_']));
            member.push(parseInt(value['sgs_members_total']));
            status.push(value['sgs_status_(supervised/graduated)']);
            year.push(parseInt(value['sgs_year_of_creation']));
            year_amount = value['year_amount'];
        });

        $scope.sg_number = sg.length;
        var min_year = Math.min.apply(Math, year);
        var max_year = Math.max.apply(Math, year);
        if (min_year == max_year) {
            $scope.year_creation = min_year;
        } else {
            $scope.year_creation = min_year + " to " + max_year;
        }

        $scope.total_member = numeral(member.reduce(add, 0)).format();
        $scope.total_female = numeral(female.reduce(add, 0)).format();
        $scope.total_male = numeral(male.reduce(add, 0)).format();

        if (unique(partner) == 'N/A') {
            $scope.partner_number = 'N/A';
        } else {
            $scope.partner_number = unique(partner).length;
        }

        if (unique(ngo).length == 1) {
            $scope.ngo_number = unique(ngo)[0];
        } else {
            $scope.ngo_number = unique(ngo).length;
        }

        $scope.total_loan = numeral(loan.reduce(add, 0)).format();
        $scope.total_saved = numeral(saved.reduce(add, 0)).format();
        var status_dump = compressArray(status);
        console.log(status_dump);
        if (status_dump.length == 1) {
            if (status_dump[0].value == 'Supervised') {
                $scope.supervised_num = numeral(status_dump[0].count).format();
                $scope.graduated_num = numeral(0).format();
            } else {
                $scope.supervised_num = numeral(0).format();
                $scope.graduated_num = numeral(status_dump[0].count).format();
            }
        } else {
            if (status_dump[0].value == 'Supervised') {
                $scope.supervised_num = numeral(status_dump[0].count).format();
                $scope.graduated_num = numeral(status_dump[1].count).format();
            } else {
                $scope.supervised_num = numeral(status_dump[1].count).format();
                $scope.graduated_num = numeral(status_dump[0].count).format();
            }
        }

        $scope.year_amount = year_amount;


        console.log(loan);
        console.log(saved);
        console.log(location);

    }


    function add(a, b) {
        return parseInt(a) + parseInt(b);
    }


    function unique(list) {
        var result = [];
        $.each(list, function(i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
        });
        return result;
    }


    $scope.saveData = function(originalpath, filename) {
        $scope.disabled = true;
        $scope.savedValue = "Saving ...";
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var user_id = restoreUser();

        var data = '{"original":"' + originalpath + '","saved":"","user_id":"' + user_id + '","filename":"' + filename + '"}';

        $http.post('https://sgapi.bnr.rw/api/v1/file/user/', data, config)
            .success(function(data, status, header, config) {

                if (data.auth) {
                    console.log(data);
                    $scope.showDataUlploaded = false;
                    $scope.successfullySaved = true;
                }
            });


    }


    $scope.signout = function() {
        var destroy = destroyUser();
        if (destroy) {
            $location.path("/logout")

        }

    }

    // LoadViewAllData
    viewAllData();

    function viewAllData() {

    }

    // Function to call in excelfileCTRL


    backgroudHeight();


}]);




myapp.controller('mapCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    // Settings
    
    // Visual Front-Map
    $scope.dataButton = true;
    $scope.signinButton = false;
    $scope.userHeader = true;
    $scope.hrLine = true;
    
    if ($location.path() === '/'){
        console.log('Home Button');
        $scope.dataButton = false;
        $scope.signinButton = true;
        $scope.userHeader = false;
        $scope.hrLine = false;
    }
    
    // 
    
    $scope.redirectSignIn = function(){
        $location.path("/signin");
    }
    
    
    $(window).resize(function(){
        console.log($( window ).width());
        if($( window ).width() < 1080){
            $("main").hide();
            $("body").html("<h2 class='text-center'>Oops!</h2><h4 class='text-center'>Switch to bigger screen greater than 1024px to view the map</h4>");
        }else{
            location.reload();
        }
    });
    
    
     var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    
     var user_id = localStorage.getItem('u___');
    var url = 'https://sgapi.bnr.rw/api/v1/params/1';

        $http.get(url)
            .success(function(data, status, header, config) {
                console.log(data);
                $scope.name = data.user.names;
                $scope.email = data.user.email;
                if(data.user.user_role=="1"){
                    $scope.parameters = true;
                    user_params(data.upload, data.signup);
                }else{
                    $scope.parameters = false;
                }
            }).error(function(data, status, header, config) {

            });
    
    function user_params(upload, signup){
        console.log(upload, signup);
        
        if (upload){
            $("#u_activate").attr("checked", "checked");
            $scope.upload_show = true;
            
        }else{
            $("#u_deactivate").attr("checked", "checked");
            $scope.upload_show = false;
        }
        
        if (signup){
            $("#s_activate").attr("checked", "checked");
            $scope.signup_show = true
        }else{
            $("#s_deactivate").attr("checked", "checked");
            $scope.signup_show = false;

        }
    }
    
    
    $('input[type=radio][name=upload]').change(function() {
        var val = this.value;
        var url ='https://sgapi.bnr.rw/api/v1/params/upload/'+user_id+'/'+val;
        $http.put(url).success(function(data, status, header, config){
           user_params(data.upload, data.signup); 
        }).error(function(data, status, header, config){
            console.log(data);
        });
    });
    
    $('input[type=radio][name=signup]').change(function() {
        var val = this.value;
        var url ='https://sgapi.bnr.rw/api/v1/params/signup/'+user_id+'/'+val;
        $http.put(url).success(function(data, status, header, config){
            console.log(data);
           user_params(data.upload, data.signup); 
        }).error(function(data, status, header, config){
            console.log(data);
        });
    });
    
    $("#change_password").click(function(e){
        e.preventDefault();
        var current_password, new_password, confirm_password;
        current_password = $scope.c_password;
        new_password = $scope.n_password;
        confirm_password = $scope.co_password;
        
        var url = 'https://sgapi.bnr.rw/api/v1/users/check_password/'+user_id;
        var data = '{"password":"'+current_password+'"}';
        $http.put(url, data, config)
            .success(function(data, status, header, config){
                if (data){
                    check_new_password(new_password, confirm_password);
                }else{
                   $scope.error = 'Current password is not matching!'; 
                }
            })
        
        
    });
    
    
    function check_new_password(new_password, confirm_password){
        if (new_password == confirm_password){
            var data = '{"password":"'+new_password+'"}';
            var url = 'https://sgapi.bnr.rw/api/v1/change/password/'+user_id;
            $http.put(url, data, config).success(function(data, status, header, config){
                if(data){
                    $scope.error = '';
                    $scope.success = 'Password successfuly changed!';
                }
            })
        }else{
            $scope.error = 'New and confirm password are not matching!'; 
        }
    }
    
    
    $("#edit_setting").click(function(e){
        e.preventDefault();
        var name = $scope.name;
        var email = $scope.email;
        $scope.usernames_p = name;
        
        var data = '{"email":"'+email+'", "names":"'+name+'"}';
        var url = 'https://sgapi.bnr.rw/api/v1/users/'+user_id;
        $http.put(url, data, config)
            .success(function(data, status){
                console.log(data);
            }).error(function(data, status, header, config){
                console.log(status, data)
            });
        
    });
    
    
    $("#help_modal").click(function(e){
       e.preventDefault();
        var title = $scope.title;
        var message = $scope.message;
        var email, name, username ;
        var url = 'https://sgapi.bnr.rw/api/v1/user/'+user_id;
        $http.get(url).success(function(data, status){
           console.log(data); 
            email = data.user.email;
            name = data.user.names;
            username = data.user.username;
            sendEmailMessage(title, message, email, name, username);
        }).error(function(data, status, header, config){
            
        });
        
    });
    
    
    function sendEmailMessage(title, message, email, name, username){
        var data = '{"email":"'+email+'", "names":"'+name+'","title":"'+title+'","message":"'+message+'","username":"'+username+'"}';
        var url = 'http://127.0.01.:5000/api/v1/help/message/';
        $http.post(url, data, config).success(function(data, status, header, config){
           console.log(data); 
        }).error(function(data, status, header, config){
            
        });
    }
    
    
    $scope.lunchModal = function(){
        $('#modal').modal('show');
    }
    
    $scope.lunchModalHelp =  function(){
        $("#modalHelp").modal('show');
    }
    
    
    leafletCartix();
    selectBox();
    
    

    // loadProvinceSelectBox
    loadProvinceSelectBox('#province_map', $http);


    // load map

    var data = $("#national_map").val();
    (new leafletCartix()).handlerNational(data);

    $("#national_map").change(function() {
        var data = $("#national_map").val();
        (new leafletCartix()).handlerNational(data);
    });



    // loadDistrictSelectBox()
    /*var district_id = $("#province_map").val().split(",")[0];
    loadDistrictSelectBox(district_id);*/

    $("#province_map").change(function() {
        var province_id = $("#province_map").val().split(",")[0];
        var province_name = $("#province_map").val().split(",")[1].toLowerCase();

        loadDistrictSelectBox(province_id, '#district_map', $http);
        (new leafletCartix()).handlerProvince(province_name);


    });

    $("#district_map").change(function() {
        var district_name = $("#district_map").val().split(",")[1].toLowerCase();
        (new leafletCartix()).handlerDistrict(district_name);

    });



    // loading saving year
    loadSavingYear();

    function loadSavingYear() {
        $http.get('https://sgapi.bnr.rw/api/v1/saving_year/')
            .success(function(data, status, header, config) {
                console.log(data);
                var options = '';
                $.each(data, function(key, value) {
                    options += "<option>" + value + "</option>";
                });

                $("#year, #ddlCars17").html(options);
                $("#year, #ddlCars17").multiselect('rebuild');

            });
    }


    // load int_ngo
    loadIntNgo();

    function loadIntNgo() {
        $http.get('https://sgapi.bnr.rw/api/v1/int_ngo/')
            .success(function(data, status, header, config) {
                console.log(data);
                var options = "";
                $.each(data, function(key, value) {
                    options += "<option value='" + value.id + "'>" + value.name + "</option>"
                });

                $("#saving_group_map").html(options);
                $("#saving_group_map").multiselect('rebuild');
            });
    }



    // logged NGO name

    function loggedNgoName() {
        var ngo_id = restoreNgo();
        var url = "https://sgapi.bnr.rw/api/v1/ngo/" + ngo_id;

        $http.get(url).success(function(data, status, header, config) {
                $scope.ngo_name = data.ngo.name;
            })
            .error(function(data, status, header, config) {

            });
    }


    // logged user name 
    loggedUserName();

    function loggedUserName() {
        var user_id = localStorage.getItem('u___');
        var url = 'https://sgapi.bnr.rw/api/v1/user/' + user_id;

        $http.get(url)
            .success(function(data, status, header, config) {
                console.log(data);
                $scope.usernames_p = data.user.names;
            }).error(function(data, status, header, config) {

            });
    }

    
    // ########### Year Survey  #############
    
    $scope.yearSurvey = 2014;
    analyticsNumber($scope.yearSurvey);
    $("#year").change(function(){
        $scope.yearSurvey = $("#year").val();
        analyticsNumber($scope.yearSurvey);
    });
    
    // ############# Analytics Numbers #######
    
    function analyticsNumber(year){
        var url = 'https://sgapi.bnr.rw/api/v1/analytics/numbers/'+year;
        $http.get(url)
            .success(function(data, status, header, config){
                $scope.sg_count = numeral(data.sg_count).format();
                $scope.membership = numeral(data.membership).format();
                $scope.saving = numeral(data.saving).format();
                $scope.borrowing = numeral(data.borrowing).format();
            }).error(function(data, status, header, config){
                console.log(data);
            });
        
    }
    

    // ########## Chart function ############
    
    function chart_filters_init(){
        $scope.valSeclectedName = 'Analytics';
        $scope.saving_group_filter = true;
        $scope.financial = true;
        $scope.agent = true;
        $scope.finscope = true;
    }
    
    chart_filters_init();
    
    $scope.menuChart = function(val){
        $scope.valSeclectedName = val;
        if (val == 'Saving Group Analytics'){
            $scope.saving_group_filter = true;
            $scope.financial = false;
            $scope.agent = false;
            $scope.finscope = false;
        }else if(val == 'Financial Institutions Analytics'){
            $scope.saving_group_filter = false;
            $scope.financial = true;
            $scope.agent = false;
            $scope.finscope = false;
        }else if(val == 'Agent Analytics'){
            $scope.saving_group_filter = false;
            $scope.financial = false;
            $scope.agent = true;
            $scope.finscope = false;
        }else{
            $scope.saving_group_filter = false;
            $scope.financial = false;
            $scope.agent = false;
            $scope.finscope = true;
        }
    }
    
    
    
    
    // Chart function data 
    $scope.yearSurvey = 2014;
    var ngo = null;
    var province_ = null;
    var district_= null;
    chartFunction($http, $scope.yearSurvey, ngo, province_, district_);
    $("#year").change(function(){
        
        $scope.yearSurvey = $("#year").val();
        ngo = $("#saving_group_map").val();
        console.log(ngo);
        chartFunction($http, $scope.yearSurvey, ngo, province_, district_);
        showLoader();
        chart_filters_init()
    });
    
    
    $("#saving_group_map").change(function(){
        $scope.yearSurvey = $("#year").val();
        ngo = $("#saving_group_map").val();
        console.log(ngo);
        chartFunction($http, $scope.yearSurvey, ngo, province_, district_);
        showLoader();
        chart_filters_init()
    });
    
    $("#province_map").change(function(){
        console.log($("#province_map").val());
        if($("#province_map").val() === "0"){
            alert("djdjdjdjdjdjj");
        }else{
            province_ = $("#province_map").val().split(",")[0];
            district_= null;
            $scope.yearSurvey = $("#year").val();
            ngo = $("#saving_group_map").val();
            chartFunction($http, $scope.yearSurvey, ngo, province_, district_);
            showLoader(); 
            chart_filters_init()
        }
        
    });
    
    $("#district_map").change(function(){
        district_ = $("#district_map").val().split(",")[0];
        console.log(district_);
        $scope.yearSurvey = $("#year").val();
        ngo = $("#saving_group_map").val();
        chartFunction($http, $scope.yearSurvey, ngo, province_, district_);
        showLoader();
        chart_filters_init()
    });
    
    $("#national_map").change(function(){
        ngo = null;
        province_ = null;
        district_= null;
        chartFunction($http, $scope.yearSurvey, ngo, province_, district_);
        showLoader();
        chart_filters_init()
    });
    
    

}]);

$("#loader").hide();

function showLoader(){
        var windowHeight = $(".map-height").height();
        $("#loader").css("height", windowHeight);
        $("#loader").addClass('opacity');
        $("#loader").show();
    }
    
    function hideLoader(){
        $("#loader").css("height", 0);
        $("#loader").removeClass('opacity');
        $("#loader").hide();
    }


myapp.controller('notificationCtrl', ['$scope', '$http', 'AuthService', '$q', function($scope, $http, AuthService, $q) {

    
    
     var user_id = localStorage.getItem('u___');
    var url = 'https://sgapi.bnr.rw/api/v1/params/1';

        $http.get(url)
            .success(function(data, status, header, config) {
                console.log(data);
                $scope.name = data.user.names;
                $scope.email = data.user.email;
                if(data.user.user_role=="1"){
                    $scope.parameters = true;
                    user_params(data.upload, data.signup);
                }else{
                    $scope.parameters = false;
                }
            }).error(function(data, status, header, config) {

            });
    
    function user_params(upload, signup){
        console.log(upload, signup);
        
        if (upload){
            $("#u_activate").attr("checked", "checked");
            $scope.upload_show = true;
            
        }else{
            $("#u_deactivate").attr("checked", "checked");
            $scope.upload_show = false;
        }
        
        if (signup){
            $("#s_activate").attr("checked", "checked");
            $scope.signup_show = true
        }else{
            $("#s_deactivate").attr("checked", "checked");
            $scope.signup_show = false;

        }
    }
    
    $('input[type=radio][name=upload]').change(function() {
        var val = this.value;
        var url ='https://sgapi.bnr.rw/api/v1/params/upload/'+user_id+'/'+val;
        $http.put(url).success(function(data, status, header, config){
           user_params(data.upload, data.signup); 
        }).error(function(data, status, header, config){
            console.log(data);
        });
    });
    
    $('input[type=radio][name=signup]').change(function() {
        var val = this.value;
        var url ='https://sgapi.bnr.rw/api/v1/params/signup/'+user_id+'/'+val;
        $http.put(url).success(function(data, status, header, config){
           user_params(data.upload, data.signup); 
        }).error(function(data, status, header, config){
            console.log(data);
        });
    });
    
    $scope.notifAdmin = true;
    $scope.notifNgo = false;
    

    // User role
    var user_id = localStorage.getItem('u___');
    AuthService.userRole(user_id)
        .then(function() {
            adminController();
        }).catch(function() {
            ngoStatus();
        });


    // NGO Status
    function ngoStatus() {
        $scope.notifAdmin = false;
        $scope.notifNgo = true;
        var ngo_id = AuthService.getNgo()
        console.log(ngo_id);
        AuthService.ngoStatus(ngo_id)
            .then(function() {
                intlNgoHandler(ngo_id);
            }).catch(function() {
                console.log("status");
                localNgoHandler(ngo_id);
            });

    }


    function adminController() {
        $scope.notifAdmin = true;
        $scope.notifNgo = false;
        

        // load all ngos
        loadIntNgo("#int_ngo", $http)



        $scope.loadLocalNgo = function(int_ngo_filter) {
            //console.log(int_ngo_filter);
            var url = 'https://sgapi.bnr.rw/api/v1/int_ngo/partner/' + int_ngo_filter;
            $http.get(url)
                .success(function(data, status, header, config) {
                    var options = "";
                    $.each(data, function(key, value) {
                        options += "<option value='" + value.id + "'>" + value.name + "</option>";
                    });

                    $("#local_ngo_admin").html(options);
                    $("#local_ngo_admin").multiselect('rebuild');
                }).error(function(data, status, header, config) {

                })
        }


        // Load years
        loadFilesYear()

        function loadFilesYear() {
            var url = "https://sgapi.bnr.rw/api/v1/saving_year";
            $http.get(url)
                .success(function(data, status, header, config) {
                    console.log(data);
                    var options = "";
                    $.each(data, function(key, value) {
                        options += "<option value='" + value + "'>" + value + "</option>";
                    });

                    $("#year_admin").html(options);
                    $("#year_admin").multiselect('rebuild');
                }).error(function() {

                });
        }



        // LoadAll files
        loadNgoFiles()

        function loadNgoFiles() {
            var url = "https://sgapi.bnr.rw/api/v1/files";
            $http.get(url)
                .success(function(data, status, header, config) {
                    console.log(data);
                    $scope.files = data;
                })
                .error(function(data, status, header, config) {

                });


        }
    }


    function intlNgoHandler(ngo_id) {
        console.log("Main intlNgoHandler");
        $scope.notifAdmin = false;
        $scope.notifNgo = true;
        

        var user_id = localStorage.getItem('u___');

        // LoadAll files
        loadNgoFiles(user_id)

        function loadNgoFiles(user_id) {
            var url = "https://sgapi.bnr.rw/api/v1/files/user/" + user_id;
            $http.get(url)
                .success(function(data, status, header, config) {
                    console.log(data);
                    $scope.files = data;
                })
                .error(function(data, status, header, config) {

                });
        }

        //loadInternational local Partner
        loadLocalPartner(ngo_id);

        function loadLocalPartner(ngo_id) {
            console.log(ngo_id);
            var url = 'https://sgapi.bnr.rw/api/v1/int_ngo/partner/' + ngo_id;
            $http.get(url)
                .success(function(data, status, header, config) {
                    console.log(data);
                    var options = "";
                    $.each(data, function(key, value) {
                        options += "<option value='" + value.id + "'>" + value.name + "</option>";
                    });

                    $("#local_ngo, #ddlCars9").html(options);
                    $("#local_ngo, #ddlCars9").multiselect('rebuild');
                }).error(function(data, status, header, config) {

                })
        }

        // Load years
        loadFilesYear()

        function loadFilesYear() {
            var url = "https://sgapi.bnr.rw/api/v1/saving_year";
            $http.get(url)
                .success(function(data, status, header, config) {
                    console.log(data);
                    var options = "";
                    $.each(data, function(key, value) {
                        options += "<option value='" + value + "'>" + value + "</option>";
                    });

                    $("#year_ngo").html(options);
                    $("#year_ngo").multiselect('rebuild');
                }).error(function() {

                });
        }



    }

    function localNgoHandler(ngo_id) {
        console.log("Local NGO Handler");
    }

}]);



myapp.controller('SettingCtrl', ['$scope','$http','AuthService', '$q', function($scope, $http, AuthService, $q){
    
}])


myapp.controller('viewAlldataCtrl', ['$scope', '$http', 'AuthService', '$q', function($scope, $http, AuthService, $q) {
    
    var user_id = localStorage.getItem('u___');
    AuthService.userRole(user_id)
        .then(function() {
            adminControllerData();
        }).catch(function() {
            ngoStatus();
        });


    // NGO Status
    function ngoStatus() {
        $scope.notifAdmin = false;
        $scope.notifNgo = true;
        var ngo_id = AuthService.getNgo()
        console.log(ngo_id);
        AuthService.ngoStatus(ngo_id)
            .then(function() {
                intlNgoHandler(ngo_id);
            }).catch(function() {
                localNgoHandler(ngo_id);
            });

    }


    // Load Rwanda Administrative location
    loadProvinceSelectBoxDataView('#ddlCars13', $http);

    
    
    // change on Ngos
    
    $("#viewdata_btn").click(function(e){
        alert("clciked");
        var province_ids = $("#ddlCars13").val();
        var district_id = $("#ddlCars14").val();
        var sector_id = $("#ddlCars15").val();
        var ngo_id = $("#ddlCars16").val();
        var year = $("#ddlCars17").val();
        var type = 0;
        console.log(province_ids, district_id, sector_id, ngo_id, year);
        renderViewdata(province_ids, district_id, sector_id, ngo_id,year,type, $http, $scope);
    });
    
    $("#viewdata_btn_int").click(function(e){
        var province_ids = $("#ddlCars13").val();
        var district_id = $("#ddlCars14").val();
        var sector_id = $("#ddlCars15").val();
        var ngo_id = $("#ddlCars9").val();
        var year = $("#ddlCars17").val();
        var type = 1;
        console.log(province_ids, district_id, sector_id, ngo_id, year);
        renderViewdata(province_ids, district_id, sector_id, ngo_id,year,type, $http, $scope);
    });
    
    
    
    $("#viewdata_btn_local").click(function(e){
        var province_ids = $("#ddlCars13").val();
        var district_id = $("#ddlCars14").val();
        var sector_id = $("#ddlCars15").val();
        var ngo_id = AuthService.getNgo();
        var year = $("#ddlCars17").val();
        var type = 2;
        renderViewdata(province_ids, district_id, sector_id, ngo_id,year,type, $http, $scope);
    })
    
    
    
    // Download button ng-show ng-click
    
    $scope.dataDownload = false;
    
    $scope.downloadExcel = function(query, year){
        console.log(query, year);
        // config variable for http post
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var data = '{"query":"'+query+'", "year":"'+year+'"}'
        var url = 'https://sgapi.bnr.rw/api/v1/data/download/';
        $http.post(url, data, config)
            .success(function(data, status, header, config){
                console.log(data);
                $scope.url = data;
            }).
            error(function(data, status, header, config){
                console.log(data);
            });
    }
    // Render View data
    
    function renderViewdata(province_ids, district_id, sector_id, ngo_id,year,type, $http, $scope){
        var url = 'https://sgapi.bnr.rw/api/v1/data/view/'+province_ids+'/'+district_id+'/'+sector_id+'/'+ngo_id+'/'+year+'/'+type;
        $http.get(url)
            .success(function(data, status, header, config){
                console.log(data);
                $scope.saving_group = numeral(data.saving_group).format();
                $scope.year_of_creation = data.year_of_creation.length;
                $scope.total_member = numeral(data.total_member).format();
                $scope.member_female = numeral(data.member_female).format();
                $scope.member_male = numeral(data.member_male).format();
                
                if (type == 0){
                    $scope.funding_ngo = data.funding_ngo.length;
                    $scope.partner_number = ngo_id.length || 0;  
                }else if (type == 1){
                    $scope.funding_ngo = ngo_id.length || 0; 
                    $scope.partner_number = 1;  
                }else{
                    $scope.funding_ngo = 1;
                    $scope.partner_number = data.funding_ngo.length; 
                }
                
                
                $scope.supervised = numeral(data.supervised).format();
                $scope.graduated = numeral(data.graduated).format();
                $scope.year = year;
                $scope.saving = numeral(data.saving).format();
                $scope.borrowing= numeral(data.borrowing).format();
                
                $scope.sqlQuery = data.query;
                $scope.dataDownload = true;
            });
    }
    
    
    $("#ddlCars13").change(function(e) {
        var province_ids = $("#ddlCars13").val();    
        viewDataLoadDistrict(province_ids, $http);
    
    });

    $("#ddlCars14").change(function(e) {
        var district_id = $("#ddlCars14").val();
        console.log(district_id);
        viewDataLoadSector(district_id, $http);
    });
    
    function viewDataLoadSector(ids, $http){
        var url = 'https://sgapi.bnr.rw/api/v1/data/sector/'+ids;
        $http.get(url)
            .success(function(data, status, header, config){
                console.log(data);
                var options = "";
                $.each(data, function(key, val){
                    options += "<option value=" + val.id + " >" + val.name + "</option>";
                });
            
                $("#ddlCars15").html(options);
                $("#ddlCars15").multiselect('rebuild');
                $("#ddlCars15").multiselect({
                    includeSelectAllOption: true
                });
                
            });
    }

    function viewDataLoadDistrict(ids, $http){
        var url = 'https://sgapi.bnr.rw/api/v1/data/district/'+ids;
        $http.get(url)
            .success(function(data, status, header, config){
                console.log(data);
                var options = "";
                $.each(data, function(key, val){
                    options += "<option value=" + val.id + " >" + val.name + "</option>";
                });
            
                $("#ddlCars14").html(options);
                $("#ddlCars14").multiselect('rebuild');
                $("#ddlCars14").multiselect({
                    includeSelectAllOption: true
                });
                
            });
    }

    function adminControllerData() {
        $scope.intlNgo = true;
        $scope.localNgo = false;
        $scope.admin_btn = true;
        $scope.int_btn = false;
        $scope.local_btn = false;
        $("#dataNgoHandler #changeColClass").removeClass("col-md-4").addClass("col-md-4");
        var idBox = "#ddlCars16";
        loadIntNgo(idBox, $http);
    }


    function intlNgoHandler(ngo_id) {
        $scope.intlNgo = false;
        $scope.localNgo = true;
        $scope.admin_btn = false;
        $scope.int_btn = true;
        $scope.local_btn = false;
        $("#dataNgoHandler #changeColClass").removeClass("col-md-4").addClass("col-md-4");
        var idBox = "#ddlCars16";
        loadIntNgo(idBox, $http);
    }

    function localNgoHandler(ngo_id) {
        $scope.intlNgo = false;
        $scope.localNgo = false;
        $scope.local_btn = true;

        $("#dataNgoHandler #changeColClass").removeClass("col-md-4").addClass("col-md-4");

    }

}]);


// International NGO

function loadIntNgo(idBox, $http) {
    $http.get('https://sgapi.bnr.rw/api/v1/int_ngo/')
        .success(function(data, status, header, config) {
            console.log(data);
            var options = "";
            $.each(data, function(key, value) {
                options += "<option value='" + value.id + "'>" + value.name + "</option>"
            });

            $(idBox).html(options);
            $(idBox).multiselect('rebuild');
        });
}




// Provinces 

function loadProvinceSelectBox(idBox, $http) {
    $http.get('https://sgapi.bnr.rw/api/v1/kenessa/province/province/all')
        .success(function(data, status, header, config) {
            console.log(data);
            var options = "";
            $.each(data, function(key, value) {
                options += "<option value=" + [value.id, value.name] + " >" + value.name + "</option>";
            });
            $(idBox).html(options);
            $(idBox).multiselect('rebuild');
            $(idBox).multiselect({
                includeSelectAllOption: true
            });

        });
}



function loadProvinceSelectBoxDataView(idBox, $http) {
    $http.get('https://sgapi.bnr.rw/api/v1/kenessa/province/province/all')
        .success(function(data, status, header, config) {
            console.log(data);
            var options = "";
            $.each(data, function(key, value) {
                options += "<option value=" + value.id + " >" + value.name + "</option>";
            });
            $(idBox).html(options);
            $(idBox).multiselect('rebuild');
            $(idBox).multiselect({
                includeSelectAllOption: true
            });

        });
}



function loadDistrictSelectBox(province_id, idBox, $http) {
    $http.get('https://sgapi.bnr.rw/api/v1/kenessa/province/district/' + province_id)
        .success(function(data, status, header, config) {
            console.log(data);
            var options = "";
            $.each(data, function(key, value) {
                $.each(value[0].district, function(k, v) {
                    console.log(v);
                    options += "<option value=" + [v.id, v.name] + " >" + v.name + "</option>";
                });
            });

            $(idBox).html(options);
            $(idBox).multiselect('rebuild');
            $(idBox).multiselect({
                includeSelectAllOption: false
            });

        });

    return true;
}



function loadSectorSelectBox(district_id, idBox, $http) {
    alert(district_id);
    var url = 'https://sgapi.bnr.rw/api/v1/kenessa/district/sector/' + district_id;
    $http.get(url)
        .success(function(data, status, header, config) {
            console.log(data);
            var options = "";
            $.each(data, function(key, value) {
                options += "<option value=" + [value.id, value.name] + " >" + value.name + "</option>";
            });

            $(idBox).html(options);
            $(idBox).multiselect('rebuild');
            $(idBox).multiselect({
                includeSelectAllOption: false
            });
        });
}

function backgroudHeight() {
    $(".map-box").css("height", function(height) {
        return $(document).height();
    })
}




function storeUser(User) {
    localStorage.setItem('u___', User);
    return 1;
}

function storeJson(json) {
    localStorage.setItem('j___', json);
}


function restoreUser() {
    var user_id = localStorage.getItem('u___');
    return user_id;
}

function destroyUser() {
    localStorage.removeItem('u___');
    return 1;
}

function storeNgo(id) {
    localStorage.setItem('n___', id);
}

function restoreNgo() {
    var ngo_id = localStorage.getItem('n___');
    return ngo_id;
}



function openNav() {
    var windowHeight = $(".map-height").height();
    
    $("#call-opacity").css("height", windowHeight);
    document.getElementById("mySidenav").style.width = "50%";
    document.body.style.backgroundColor = "#fff";
    document.getElementById("call-opacity").className = "opacity";
}

function closeNav() {
    var windowHeight = $(".map-height").height();
    $("#call-opacity").css("height", 0);
    document.getElementById("mySidenav").style.width = "0";
    document.body.style.backgroundColor = "white";
    document.getElementById("call-opacity").className = "";
}

function openNav1() {
    var windowHeight = $(".map-height").height();
    $("#call-opacity").css("height", windowHeight);
    document.getElementById("mySidenav1").style.width = "50%";
    document.body.style.backgroundColor = "#fff";
    document.getElementById("call-opacity").className = "opacity";
}

function closeNav_() {
    var windowHeight = $(".map-height").height();
    $("#call-opacity").css("height", windowHeight);
    document.getElementById("mySidenav1").style.width = "0";
    document.body.style.backgroundColor = "#fff";
    document.getElementById("call-opacity").className = "opacity";
}


function openNav2() {
    var windowHeight = $(".map-height").height();
    $("#call-opacity").css("height", windowHeight);
    $("#mySidenav2").css({
        "width": "50%",
        "background-color": "#fff"
    });
    $("#call-opacity").addClass("opacity");
}

function closeNav2() {
    var windowHeight = $(".map-height").height();
    $("#call-opacity").css("height", windowHeight);
    $("#mySidenav2").css({
        "width": "0%",
        "background-color": "#fff"
    });
    //$("#call-opacity").removeClass("opacity");
}

function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}


function chartFunction($http, year, ngo, province, district) {
    
    // Default URL 
   
   
    
    // MEMBERSHIP PER GENDER
     $http.get('https://sgapi.bnr.rw/api/v1/chartanalytics/membership/'+year+'/'+ngo+'/'+province+'/'+district)
        .success(function(data, status, header, config){
             var layout = {
                autosize: true,
                showlegend: true,
                legend:{
                    orientation	: 'h',
                    x:0,
                    y:-0.2
                },
                margin: {
                    l: 0,
                    r: 0
                },
                title: data.membership[1]
            };
            
            Plotly.newPlot('container_pie', data.membership[0], layout);
        }).error(function(data, status, header, config){
         
        });
    
    
    // Saving group per internation NGO
    $http.get('https://sgapi.bnr.rw/api/v1/chartanalytics/sg/'+year+'/'+ngo+'/'+province+'/'+district)
        .success(function(data, status, header, config){
        
            var layout = {
                autosize: true,
                showlegend: true,
                hidesources: true,
                legend:{
                    orientation	: 'h',
                    x:0,
                    y:0
                },
                margin: {
                    l: 50,
                    r: 50,
                    t: -800
                },
                title: data.sg[1]
            };
        
            Plotly.newPlot('sg_per_int_ngo', data.sg[0], layout);
        
        }).error(function(data, status, header, config){
        
        })
   
    // Saving Group Status per Intl NGos
    $http.get('https://sgapi.bnr.rw/api/v1/chartanalytics/status/'+year+'/'+ngo+'/'+province+'/'+district)
        .success(function(data, status, header, config){

            var layout_bar = {
                barmode: 'group',
                autosize: true,
                showlegend: true,
                legend:{
                    orientation	: 'h',
                    x:0,
                    y:-1
                },
                margin: {
                    l: 40,
                    r: 40,
                    b: 180
                },
                xaxis: {
                    tickangle: 90,
                    tickfont: {
                        size: 10
                    }
                },
                title: data.status[1],
            };

            Plotly.newPlot('container', data.status[0], layout_bar, {
                showLegend: true
            });
        }).error(function(data, status, header, config){
        
        });
    
    /* SG Savings and Loans per Intl Ngos 
                  layout_bar will be inherited
            */ 
    $http.get('https://sgapi.bnr.rw/api/v1/chartanalytics/amount/'+year+'/'+ngo+'/'+province+'/'+district).success(function(data, status, header, config){
         var layout_bar = {
                barmode: 'group',
                autosize: true,
                showlegend: true,
                legend:{
                    orientation	: 'h',
                    x:0,
                    y:-1
                },
                margin: {
                    l: 30,
                    r: 10,
                    b: 180
                },
                xaxis: {
                    tickangle: 90,
                    tickfont: {
                        size: 10
                    }
                },
                title: data.amount[1],
            };

            Plotly.newPlot('container_saving_loan', data.amount[0], layout_bar);
    }).error(function(data, status, header, config){
        
    });
   
    // Local NGO per intenation ngo
    $http.get('https://sgapi.bnr.rw/api/v1/chartanalytics/sgNgos/'+year+'/'+ngo+'/'+province+'/'+district).success(function(data, status, header, config){
        
        var layout_bar = {
                barmode: 'stack',
                autosize: true,
                showlegend: true,
                legend:{
                    orientation	: 'h\n',
                    x:0,
                    y:-1.02
                },
                margin: {
                    l: 30,
                    r: 30,
                    b:280
                },
                xaxis: {
                    tickangle: 90,
                    tickfont: {
                        size: 10
                    }
                },
                yaxis: {
                    dtick:3000
                },
                title: data.sgNgos[1],
            };
        
            Plotly.newPlot('sg_local_per_int', data.sgNgos[0], layout_bar);
        
        
    }).error(function(data, status, header, config){
        
    });
    
    // Financial Institution with SGS
    $http.get('https://sgapi.bnr.rw/api/v1/chartanalytics/financial/'+year+'/'+ngo+'/'+province+'/'+district)
        .success(function(data, status, header, config){
            var layout_bar = {
                barmode: 'stack',
                autosize: true,
                showlegend: true,
                legend:{
                    orientation	: 'h',
                    x:0,
                    y:-0.2
                },
                margin: {
                    l: 40,
                    r: 40,
                    b:180
                },
                xaxis: {
                    tickangle: 100,
                    tickfont: {
                        size: 12
                    }
                },
                title: data.sgFinancial[1],
            };
        
            Plotly.newPlot('sg_financial', data.sgFinancial[0], layout_bar);
        }).error(function(data, status, header, config){
        
        });
    
    // Bank and Telco Agent with Saving Groups
    $http.get('https://sgapi.bnr.rw/api/v1/chartanalytics/agent/'+year+'/'+ngo+'/'+province+'/'+district).success(function(data, status, header, config){
        var layout_bar = {
                barmode: 'stack',
                autosize: true,
                showlegend: true,
                legend:{
                    orientation	: 'h',
                    x:0,
                    y:-0.2
                },
                margin: {
                    l: 40,
                    r: 40,
                    b:80
                },
                xaxis: {
                    tickangle: 100,
                    tickfont: {
                        size: 12
                    }
                },
                title: data.sgAgent[1],
            };
        
            Plotly.newPlot('sg_agent', data.sgAgent[0], layout_bar);
    }).error(function(data, status, header, config){
        
    })
    
    
    // FINSCOPE DATA
    
     var url = 'https://sgapi.bnr.rw/api/v1/chartanalytics/'+year+'/'+ngo+'/'+province+'/'+district;
    
    $http.get(url)
        .success(function(data, status, header, config) {
            
            
        
            // FInscope chart
            
            var layout_bar = {
                barmode: 'stack',
                autosize: true,
                showlegend: true,
                legend:{
                    orientation	: 'h',
                    x:0,
                    y:-0.2
                },
                margin: {
                    l: 40,
                    r: 10,
                    b:80
                },
                xaxis: {
                    tickangle: 0,
                    tickfont: {
                        size: 12
                    }
                },
                title: data.finscope[1]
            };
        
            Plotly.newPlot('container_finscope', data.finscope[0], layout_bar);
        
        
        
        // Finscope: Other Informal Vs SGs 2012 
            
            var layout_sg = {
                autosize: true,
                showlegend: true,
                legend:{
                    orientation	: 'h',
                    x:0,
                    y:-0.2
                },
                margin: {
                    l: 0,
                    r: 0
                },
                title: data.finscope_sg_2012[0][1],
                titlefont:{
                    size:14
                }
            };
            
            Plotly.newPlot('finscope_sg_pie_2012', [data.finscope_sg_2012[0][0]], layout_sg);
       
            
        var layout_sg = {
                autosize: true,
                showlegend: true,
                legend:{
                    orientation	: 'h',
                    x:0,
                    y:-0.2
                },
                margin: {
                    l: 0,
                    r: 0
                },
                title: data.finscope_sg_2015[0][1],
                titlefont:{
                    size:14
                }
            };
            
            Plotly.newPlot('finscope_sg_pie_2015', [data.finscope_sg_2015[0][0]], layout_sg);
        // Finscope all 2012
        
        var layout_bar = {
                barmode: 'stack',
                autosize: true,
                showlegend: true,
                legend:{
                    orientation	: 'h',
                    x:0,
                    y:-0.2
                },
                margin: {
                    l: 40,
                    r: 40,
                    b:80
                },
                xaxis: {
                    tickangle: 100,
                    tickfont: {
                        size: 12
                    }
                },
                title: data.finscope_all_2012[1],
            };
        
        Plotly.newPlot('finscope_all_2012', data.finscope_all_2012[0], layout_bar);
        
        // Finscope all 2015
        
        var layout_bar = {
                barmode: 'stack',
                autosize: true,
                showlegend: true,
                legend:{
                    orientation	: 'h',
                    x:0,
                    y:-0.2
                },
                margin: {
                    l: 40,
                    r: 40,
                    b:80
                },
                xaxis: {
                    tickangle: 100,
                    tickfont: {
                        size: 12
                    }
                },
                title: data.finscope_all_2015[1],
            };
        
        Plotly.newPlot('finscope_all_2015', data.finscope_all_2015[0], layout_bar);
        
        
        })
        .error(function(data, status, header, config) {
            console.log(status);
        });

        

    // SVGs_creation year per Internatonal NGOs
    var url = 'https://sgapi.bnr.rw/api/v1/analytics/creation/'+year+'/'+ngo+'/'+province+'/'+district;;
    console.log(ngo);
    $http.get(url)
        .success(function(data, status, header, config){
            console.log(data.creation);
            var layout = {
                title: data.creation[1],
                barmode: 'group',
                autosize: true,
                showlegend: true,
                legend:{
                    orientation	: 'h',
                    x:0,
                    y:-1
                },
                margin: {
                    l: 50,
                    r: 40,
                    b: 180
                },
                xaxis: {
                    tickangle: 90,
                    tickfont: {
                        size: 10
                    }
                }
            };
            Plotly.newPlot('container_year_sg', data.creation[0], layout);
            
        }).error(function(data, status, header, config){
        
        });
    
    
    
    
   
}



function selectBox() {
    $('#national_map').multiselect({
        includeSelectAllOption: true

    });
    $('#province_map').multiselect({
        includeSelectAllOption: true
    });
    $('#district_map').multiselect({
        includeSelectAllOption: true
    });
    $('#saving_group_map').multiselect({
        includeSelectAllOption: true
    });

    $('#int_ngo').multiselect({
        includeSelectAllOption: true
    });

    $('#local_ngo').multiselect({
        includeSelectAllOption: true
    });

    $('#year_ngo').multiselect({
        includeSelectAllOption: true
    });

    $('#status_ngo').multiselect({
        includeSelectAllOption: true
    });

    $('#local_ngo_admin').multiselect({
        includeSelectAllOption: true
    });

    $('#year_admin').multiselect({
        includeSelectAllOption: true
    });

    $('#status_admin').multiselect({
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
    
    $('#ddlCars17').multiselect({
        includeSelectAllOption: true
    });

    $('#year').multiselect({
        includeSelectAllOption: true
    });

}

var year;

function leafletCartix(year) {

    $("#map-cartix").html('<div id=map></div>');

    var windowHeight = ($(window).height());
    var width = ($(window).width());

    $("#map").css("height", windowHeight);


    var geojson;
    var map = L.map('map', {
        zoomControl: true
    }).setView([-2.0334, 29.8993], 9);
    map.zoomControl.setPosition('topright');
    mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; ' + mapLink,
        maxZoom: 13,
        minZoom: 2
    }).addTo(map);




    var Jsonfile;
    // https://sgapi.bnr.rw/api/v1/sqlsaving
    // assets/geojson/stats.json

    /*function jsonData(handleData){
        $.getJSON('https://sgapi.bnr.rw/api/v1/sqlsaving', function(data) {
            //console.log(data);
            handleData(data);
        }); 
    }
    
    jsonData(function(output){
       Jsonfile = output; 
    }); */




    var url, sg_ngo;
    var year = $("#year").val();
    year = year ? year : '2014';
    sg_ngo = $("#saving_group_map").val();
    url = 'https://sgapi.bnr.rw/api/v1/sqlsaving/'+sg_ngo+'/'+year;
    $("#saving_group_map").change(function() {
        sg_ngo = $("#saving_group_map").val();
        year = $("#year").val();
        url = 'https://sgapi.bnr.rw/api/v1/sqlsaving/' + sg_ngo + '/' + year;
        //console.log(url);
        Jsonfile = AjaxSgData(url);
        var data = $("#national_map").val();
        displayMap();
    });

    
    function displayMap(){
        Display("/assets/geojson/admin4.geojson");
        legend.addTo(map);
        info.addTo(map);
    }
    console.log(year);
    



    $("#year").change(function() {
        var sg_ngo = $("#saving_group_map").val();
        var year = $("#year").val();
        console.log(sg_ngo);
        console.log(year);
        url = 'https://sgapi.bnr.rw/api/v1/sqlsaving/' + sg_ngo + '/' + year;
        Jsonfile = AjaxSgData(url);
        displayMap();
    });


    Jsonfile = AjaxSgData(url);
    function AjaxSgData(url) {
        $.ajax({
            url: url,
            async: false,
            success: function(data) {
                Jsonfile = data;
            }
        });
        console.log(url,Jsonfile);
        
        return Jsonfile;
    }

    




    function getColor(d) {
        return d > 5001 ? '#7f2704' :
            d > 4001 ? '#a63603' :
            d > 3001 ? '#d94801' :
            d > 0 ? '#f16913' :
            '#fd8d3c';
    }



    function style(feature) {

        var density;

        $.each(Jsonfile.Provinces, function(key, obj) {
            if (obj.Province == feature.properties.Name) {
                density = obj.Density;
            }
        });
        return {
            fillColor: getColor(density),
            weight: 2,
            opacity: 10,
            color: 'white',
            dashArray: '3',
            fillOpacity: 10
        };

    }

    function Display(geofile) {
        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                showLoader();
                geojson = L.geoJson(rwandaData, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
            }).always(function() {
                hideLoader();
                console.log( "complete" );
              });
        } else {
            geojson.eachLayer(function(layer) {
                map.removeLayer(layer);
                map.removeControl(infoD);
                map.removeControl(legendD);
                map.removeControl(infoS);
                map.removeControl(legendS);
                map.removeControl(info);
                map.removeControl(legend);
                map.removeControl(infoP);
                map.removeControl(legendP);
            });

            $.getJSON(geofile, function(rwandaData) {
                showLoader();
                geojson = L.geoJson(rwandaData, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
            }).always(function() {
                hideLoader();
                console.log( "complete" );
              });
        }
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        });
        map.setView([-1.9404, 29.8998], 9);
    }

    function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#fff',
            dashArray: '',
            fillOpacity: 2
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        $.each(Jsonfile.Provinces, function(key, obj) {
            if (obj.Province == layer.feature.properties.Name) {
                var mm = numeral(obj.Membership).format();
                var f = numeral(obj.Female).format();
                var ml = numeral(obj.Male).format();
                var dens = numeral(obj.Density).format();
                var banks = numeral(obj.bank).format();
                var mfi = numeral(obj.mfi).format();
                var nu = numeral(obj.nsacco).format();
                var u = numeral(obj.usacco).format();
                var tl = numeral(obj.telco_agent).format();
                var ba = numeral(obj.bank_agent).format();
                var borrowing = numeral(obj.borrowing).format();
                var saving = numeral(obj.saving).format();
                info.update(layer.feature.properties, dens, mm, f, ml, banks, mfi, nu, u, tl, ba, borrowing, saving);
            }
        });

    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }
    //custom control within the map
    var info = L.control({
        position: 'topleft'
    });
    info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function(props, density, membr, fem, male, banks, mfi, nu, u, tl, ba, borrowing, saving) {

        this._div.innerHTML = '<h4>Saving groups per Province</h4>' + (props ?
            '<b>' + props.Name + ' Province</b><br />' + density + ' Saving groups<br/> <b> Total Membership: </b>' + membr + '<br/> <b> Total Female: </b>' + fem + ' <br/> <b>Total Male: </b>' + male + '</br><b>Total Out. Loans: </b>'+borrowing+'<br><b>Total Savings: </b>'+saving+'<br><b> Banks: </b>' + banks + '</br><b>MFIs: </b>' + mfi + '</br><b> Non-Umurenge Sacco: </b>' + nu + '</br><b>Umurenge Sacco:</b>' + u + '</br><b>Telco Agents: </b>' + tl + '</br><b>Bank Agents:</b>' + ba + '</br>' :
            'Hover over a province');

    };
    //legend
    var legend = L.control({
        position: 'bottomright'
    });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 3001, 4001, 5001],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    function getColorP(d) {
        return d > 2001 ? '#7f2704' :
            d > 1501 ? '#a63603' :
            d > 1001 ? '#d94801' :
            d > 501 ? '#f16913' :
            d > 0 ? '#fd8d3c' :
            '#fff5eb';

    }

    function styleP(feature) {
        var density;

        $.each(Jsonfile.Districts, function(key, obj) {
            if (obj.District == feature.properties.Name) {
                density = obj.Density;
            }
        });
        return {
            fillColor: getColorP(density),
            weight: 2,
            opacity: 10,
            color: 'white',
            dashArray: '3',
            fillOpacity: 10
        };
    }
    
    function provinceDisplay(geofile) {

        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                showLoader();
                geojson = L.geoJson(rwandaData, {
                    style: styleP,
                    onEachFeature: onEachFeatureP
                }).addTo(map);
            }).always(function() {
                hideLoader();
                console.log( "complete" );
              });
        } else {
            geojson.eachLayer(function(layer) {
                map.removeLayer(layer);
                map.removeControl(infoD);
                map.removeControl(legendD);
                map.removeControl(infoS);
                map.removeControl(legendS);
                map.removeControl(info);
                map.removeControl(legend);
                map.removeControl(infoP);
                map.removeControl(legendP);
            });

            $.getJSON(geofile, function(rwandaData) {
                showLoader();
                geojson = L.geoJson(rwandaData, {
                    style: styleP,
                    onEachFeature: onEachFeatureP
                }).addTo(map);
            }).always(function() {
                hideLoader();
                console.log( "complete" );
              });
        }
    }

    function onEachFeatureP(feature, layer) {
        layer.on({
            mouseover: highlightFeatureP,
            mouseout: resetHighlightP
        });
        map.setView([-2.0334, 29.8993], 9);
    }

    function kigaliProDisplay(geofile) {

        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                showLoader();
                geojson = L.geoJson(rwandaData, {
                    style: styleP,
                    onEachFeature: onEachFeatureKP
                }).addTo(map);
            }).always(function() {
                hideLoader();
                console.log( "complete" );
              });
        } else {
            geojson.eachLayer(function(layer) {
                map.removeLayer(layer);
                map.removeControl(infoD);
                map.removeControl(legendD);
                map.removeControl(infoS);
                map.removeControl(legendS);
                map.removeControl(info);
                map.removeControl(legend);
                map.removeControl(infoP);
                map.removeControl(legendP);
            });

            $.getJSON(geofile, function(rwandaData) {
                showLoader();
                geojson = L.geoJson(rwandaData, {
                    style: styleP,
                    onEachFeature: onEachFeatureKP
                }).addTo(map);
            }).always(function() {
                hideLoader();
                console.log( "complete" );
              });
        }
    }

    function onEachFeatureKP(feature, layer) {
        layer.on({
            mouseover: highlightFeatureP,
            mouseout: resetHighlightP
        });
        var bounds = layer.getBounds();
        map.fitBounds(bounds, {
            maxZoom: 11
        });
    }

    function highlightFeatureP(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#fff',
            dashArray: '',
            fillOpacity: 2
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        $.each(Jsonfile.Districts, function(key, obj) {
            if (obj.District == layer.feature.properties.Name) {
                var mm = numeral(obj.Membership).format();
                var f = numeral(obj.Female).format();
                var ml = numeral(obj.Male).format();
                var dens = numeral(obj.Density).format();
                var banks = numeral(obj.bank).format();
                var mfi = numeral(obj.mfi).format();
                var nu = numeral(obj.nsacco).format();
                var u = numeral(obj.usacco).format();
                var tl = numeral(obj.telco_agent).format();
                var ba = numeral(obj.bank_agent).format();
                var borrowing = numeral(obj.borrowing).format();
                var saving = numeral(obj.saving).format();
                infoP.update(layer.feature.properties, dens, mm, f, ml, banks, mfi, nu, u, tl, ba, borrowing, saving);
            }
        });

    }

    function resetHighlightP(e) {
        geojson.resetStyle(e.target);
        infoP.update();
    }
    //custom control within the map
    var infoP = L.control({
        position: 'topleft'
    });
    infoP.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    infoP.update = function(props, density, membr, fem, male, banks, mfi, nu, u, tl, ba, borrowing, saving) {
        this._div.innerHTML = '<h4>Saving groups in each District per Province</h4>' + (props ?
            '<b>' + props.Name + ' District</b><br />' + density + ' Saving groups<br/> <b> Total Membership: </b>' + membr + '<br/> <b> Total Female: </b>' + fem + ' <br/> <b>Total Male: </b>' + male + '</br><b>Total Out. Loans: </b>'+borrowing+'<br><b>Total Savings: </b>'+saving+'<br><b> Banks: </b>' + banks + '</br><b>MFIs: </b>' + mfi + '</br><b> Non-Umurenge Sacco: </b>' + nu + '</br><b>Umurenge Sacco:</b>' + u + '</br><b>Telco Agents: </b>' + tl + '</br><b>Bank Agents:</b>' + ba + '</br>' :
            'Hover over a province');

    };
    //legend
    var legendP = L.control({
        position: 'bottomright'
    });
    legendP.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 501, 1001, 1501, 2001],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorP(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    function getColorD(d) {
        return d > 2001 ? '#8c2d04' :
            d > 1001 ? '#d94801' :
            d > 801 ? '#f16913' :
            d > 601 ? '#fd8d3c' :
            d > 401 ? '#fdae6b' :
            d > 201 ? '#fdd0a2' :
            d > 0 ? '#fee6ce' :
            '#fff5eb';
    }

    function styleD(feature) {
        var density;

        $.each(Jsonfile.Districts, function(key, obj) {
            if (obj.District == feature.properties.Name) {
                density = obj.Density;
            }
        });
        return {

            fillColor: getColorD(density),
            weight: 2,
            opacity: 10,
            color: 'white',
            dashArray: '3',
            fillOpacity: 10
        };
    }

    function districtDisplay(geofile) {
        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                showLoader();
                geojson = L.geoJson(rwandaData, {
                    style: styleD,
                    onEachFeature: onEachFeatureD
                }).addTo(map);
            }).always(function() {
                hideLoader();
                console.log( "complete" );
              });
        } else {
            geojson.eachLayer(function(layer) {
                map.removeLayer(layer);
                map.removeControl(infoD);
                map.removeControl(legendD);
                map.removeControl(infoS);
                map.removeControl(legendS);
                map.removeControl(info);
                map.removeControl(legend);
                map.removeControl(infoP);
                map.removeControl(legendP);
            });

            $.getJSON(geofile, function(rwandaData) {
                showLoader();
                geojson = L.geoJson(rwandaData, {
                    style: styleD,
                    onEachFeature: onEachFeatureD
                }).addTo(map);
            }).always(function() {
                hideLoader();
                console.log( "complete" );
              });
        }
    }

    function onEachFeatureD(feature, layer) {
        layer.on({
            mouseover: highlightFeatureD,
            mouseout: resetHighlightD
        });
        map.setView([-2.0334, 29.8993], 9);
    }


    function highlightFeatureD(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#fff',
            dashArray: '',
            fillOpacity: 2
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        $.each(Jsonfile.Districts, function(key, obj) {
            if (obj.District == layer.feature.properties.Name) {

                var mm = numeral(obj.Membership).format();
                var f = numeral(obj.Female).format();
                var ml = numeral(obj.Male).format();
                var dens = numeral(obj.Density).format();
                var banks = numeral(obj.bank).format();
                var mfi = numeral(obj.mfi).format();
                var nu = numeral(obj.nsacco).format();
                var u = numeral(obj.usacco).format();
                var tl = numeral(obj.telco_agent).format();
                var ba = numeral(obj.bank_agent).format();
                var borrowing = numeral(obj.borrowing).format();
                var saving = numeral(obj.saving).format();
                infoD.update(layer.feature.properties, dens, mm, f, ml, banks, mfi, nu, u, tl, ba, borrowing, saving);
            }
        });

    }

    function resetHighlightD(e) {
        geojson.resetStyle(e.target);
        infoD.update();
    }

    //custom control within the map
    var infoD = L.control({
        position: 'topleft'
    });

    infoD.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    infoD.update = function(props, density, membr, fem, male, banks, mfi, nu, u, tl, ba, borrowing, saving) {
        this._div.innerHTML = '<h4>Saving groups per District</h4>' + (props ?
            '<b>' + props.Name + ' District</b><br />' + density + ' Saving groups <br/> <b> Total Membership: </b>' + membr + '<br/> <b> Total Female: </b>' + fem + ' <br/> <b>Total Male: </b>' + male + '</br><b>Total Out. Loans: </b>'+borrowing+'<br><b>Total Savings: </b>'+saving+'<br><b> Banks: </b>' + banks + '</br><b>MFIs: </b>' + mfi + '</br><b> Non-Umurenge Sacco: </b>' + nu + '</br><b> Umurenge Sacco:</b>' + u + '</br><b>Telco Agents: </b>' + tl + '</br><b>Bank Agents:</b>' + ba + '</br>' :
            'Hover over a district');
    };
    //legend
    var legendD = L.control({
        position: 'bottomright'
    });
    legendD.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 201, 401, 601, 801, 1001, 2001, ],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorD(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    function getColorS(d) {
        return d > 141 ? '#7f2704' :
            d > 121 ? '#a63603' :
            d > 101 ? '#d94801' :
            d > 81 ? '#f16913' :
            d > 61 ? '#fd8d3c' :
            d > 41 ? '#fdae6b' :
            d > 21 ? '#fdd0a2' :
            d > 0 ? '#fee6ce' :
            '#fff5eb';
    }

    function styleS(feature) {
        var density;

        $.each(Jsonfile.Sectors, function(key, obj) {
            if (obj.District == feature.properties.District) {
                if (obj.Sector == feature.properties.Name) {
                    density = obj.Density;
                    //console.log(obj.Sector+ " "+ feature.properties.Name);
                }else{
                    //console.log(obj.Sector+ " "+ feature.properties.Name);
                }
            }
        });
        return {
            fillColor: getColorS(density),
            weight: 2,
            opacity: 10,
            color: 'white',
            dashArray: '3',
            fillOpacity: 10
        };
    }

    function sector(geofile) {
        
        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                
                geojson = L.geoJson(rwandaData, {
                    style: styleS,
                    onEachFeature: onEachFeatureSS
                }).addTo(map);
            }).always(function() {
                hideLoader();
                console.log( "complete" );
              });
        } else {
            geojson.eachLayer(function(layer) {
                map.removeLayer(layer);
                map.removeControl(infoD);
                map.removeControl(legendD);
                map.removeControl(infoS);
                map.removeControl(legendS);
                map.removeControl(info);
                map.removeControl(legend);
                map.removeControl(infoP);
                map.removeControl(legendP);
            });

            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: styleS,
                    onEachFeature: onEachFeatureSS
                }).addTo(map);
            }).always(function() {
                hideLoader();
                console.log( "complete" );
              });
        }

    }

    function sectorDisplay(geofile) {
        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                showLoader();
                geojson = L.geoJson(rwandaData, {
                    style: styleS,
                    onEachFeature: onEachFeatureS
                }).addTo(map);
            }).always(function() {
                hideLoader();
                console.log( "complete" );
              });
        } else {
            geojson.eachLayer(function(layer) {
                map.removeLayer(layer);
                map.removeControl(infoD);
                map.removeControl(legendD);
                map.removeControl(infoS);
                map.removeControl(legendS);
                map.removeControl(info);
                map.removeControl(legend);
                map.removeControl(infoP);
                map.removeControl(legendP);
            });
            
            $.getJSON(geofile, function(rwandaData) {
                showLoader();
                geojson = L.geoJson(rwandaData, {
                    style: styleS,
                    onEachFeature: onEachFeatureS
                }).addTo(map);
            }).always(function() {
                console.log( "complete" );
                hideLoader();
              });
        }

    }

    function kigaliDisplay(geofile) {

        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                showLoader();
                geojson = L.geoJson(rwandaData, {
                    style: styleS,
                    onEachFeature: onEachFeaturekigali
                }).addTo(map);
            }).always(function() {
                hideLoader();
                console.log( "complete" );
              });
        } else {
            geojson.eachLayer(function(layer) {
                map.removeLayer(layer);
                map.removeControl(infoD);
                map.removeControl(legendD);
                map.removeControl(infoS);
                map.removeControl(legendS);
                map.removeControl(info);
                map.removeControl(legend);
                map.removeControl(infoP);
                map.removeControl(legendP);
            });

            $.getJSON(geofile, function(rwandaData) {
                showLoader();
                geojson = L.geoJson(rwandaData, {
                    style: styleS,
                    onEachFeature: onEachFeaturekigali
                }).addTo(map);
            }).always(function() {
                hideLoader();
                console.log( "complete" );
              });
        }

    }

    function onEachFeaturekigali(feature, layer) {
        layer.on({
            mouseover: highlightFeatureS,
            mouseout: resetHighlightS
        });
        var bounds = layer.getBounds();
        map.fitBounds(bounds, {
            maxZoom: 11
        });

    }

    function onEachFeatureS(feature, layer) {
        layer.on({
            mouseover: highlightFeatureS,
            mouseout: resetHighlightS
        });
        var bounds = layer.getBounds();
        map.fitBounds(bounds, {
            maxZoom: 10
        });

    }

    function onEachFeatureSS(feature, layer) {

        layer.on({
            mouseover: highlightFeatureS,
            mouseout: resetHighlightS
        });
        map.setView([-2.0334, 29.8993], 9);

    }

    function highlightFeatureS(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#fff',
            dashArray: '',
            fillOpacity: 2
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        $.each(Jsonfile.Sectors, function(key, obj) {
            if (obj.District == layer.feature.properties.District) {
                if (obj.Sector == layer.feature.properties.Name) {
                    var mm = numeral(obj.Membership).format();
                    var f = numeral(obj.Female).format();
                    var ml = numeral(obj.Male).format();
                    var dens = numeral(obj.Density).format();
                    var banks = numeral(obj.bank).format();
                    var mfi = numeral(obj.mfi).format();
                    var nu = numeral(obj.nsacco).format();
                    var u = numeral(obj.usacco).format();
                    var tl = numeral(obj.telco_agent).format();
                    var ba = numeral(obj.bank_agent).format();
                    var borrowing = numeral(obj.borrowing).format();
                    var saving = numeral(obj.saving).format();
                    infoS.update(layer.feature.properties, dens, mm, f, ml, banks, mfi, nu, u, tl, ba, borrowing, saving);
                    //console.log(obj.Sector+ " "+ layer.feature.properties.Name);
                }else{
                    //console.log(obj.Sector+ " "+ layer.feature.properties.Name);
                }
            }
        });

    }

    function resetHighlightS(e) {
        geojson.resetStyle(e.target);
        infoS.update();
    }


    //custom control within the map
    var infoS = L.control({
        position: 'topleft'
    });

    infoS.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    infoS.update = function(props, density, membr, fem, male, banks, mfi, nu, u, tl, ba, borrowing, saving) {
        this._div.innerHTML = '<h4>Saving groups per Sector</h4>' + (props ?
            '<b>' + props.Name + ' Sector</b><br />' + density + ' Saving groups <br/> <b> Total Membership: </b>' + membr + '<br/> <b> Total Female: </b>' + fem + ' <br/> <b>Total Male: </b>' + male + '</br><b>Total Out. Loans: </b>'+borrowing+'<br><b>Total Savings: </b>'+saving+'<br><b> Banks: </b>' + banks + '</br><b>MFIs: </b>' + mfi + '</br><b> Non-Umurenge Sacco: </b>' + nu + '</br><b> Umurenge Sacco:</b>' + u + '</br><b>Telco Agents: </b>' + tl + '</br><b>Bank Agents:</b>' + ba + '</br>' :
            'Hover over a Sector');
    };
    //legend
    var legendS = L.control({
        position: 'bottomright'
    });

    legendS.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 21, 41, 61, 81, 101, 121, 141],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorS(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };


    this.handlerProvince = function(val) {

        document.getElementById('district_map').value = "";
        document.getElementById('national_map').value = "";
        if (val) {
            switch (val) {
                case "east":
                    provinceDisplay("/assets/geojson/Eastern_Province.geojson");
                    break;
                case "west":
                    provinceDisplay("/assets/geojson/Western_Province.geojson");
                    break;
                case "kigali":
                    kigaliProDisplay("/assets/geojson/Kigali_geojson.geojson");
                    break;
                case "north":
                    provinceDisplay("/assets/geojson/Northern_Province.geojson");
                    break;
                case "south":
                    provinceDisplay("/assets/geojson/Southern_Province.geojson");
                    break;
            }



            legendP.addTo(map);
            infoP.addTo(map);

        }


    }

    this.handlerNational = function(val) {
        showLoader();
        document.getElementById('province_map').value = "";
        document.getElementById('district_map').value = "";

        if (val) {
            switch (val) {
                case "provinces":
                    Display("/assets/geojson/admin4.geojson");
                    legend.addTo(map);
                    info.addTo(map);
                    break;
                case "districts":
                    districtDisplay("/assets/geojson/District_Rwanda.geojson");
                    legendD.addTo(map);
                    infoD.addTo(map);
                    break;
                case "sectors":
                    sector("/assets/geojson/Sector_Rwanda.geojson");
                    legendS.addTo(map);
                    infoS.addTo(map);
                    break;
            }

        }
    }

    
    function HandlerNa(val){
        if (val) {
            switch (val) {
                case "provinces":
                    Display("/assets/geojson/admin4.geojson");
                    legend.addTo(map);
                    info.addTo(map);
                    break;
                case "districts":
                    districtDisplay("/assets/geojson/District_Rwanda.geojson");
                    legendD.addTo(map);
                    infoD.addTo(map);
                    break;
                case "sectors":
                    sector("/assets/geojson/Sector_Rwanda.geojson");
                    legendS.addTo(map);
                    infoS.addTo(map);
                    break;
            }

        }
    }


    this.handlerDistrict = function(val) {
        document.getElementById('province_map').value = "";
        document.getElementById('national_map').value = "";

        if (val) {
            switch (val) {
                case "gasabo":
                    kigaliDisplay("/assets/geojson/districts/Gasabo.geojson");

                    break;
                case "kicukiro":
                    kigaliDisplay("/assets/geojson/districts/Kicukiro.geojson");
                    break;
                case "nyarugenge":
                    kigaliDisplay("/assets/geojson/districts/Nyarugenge.geojson");
                    break;
                case "burera":
                    sectorDisplay("/assets/geojson/districts/Burera.geojson");
                    break;
                case "gakenke":
                    sectorDisplay("/assets/geojson/districts/Gakenke.geojson");
                    break;
                case "gicumbi":
                    sectorDisplay("/assets/geojson/districts/Gicumbi.geojson");
                    break;
                case "musanze":
                    sectorDisplay("/assets/geojson/districts/Musanze.geojson");
                    break;
                case "rulindo":
                    sectorDisplay("/assets/geojson/districts/Rulindo.geojson");
                    break;
                case "gisagara":
                    sectorDisplay("/assets/geojson/districts/Gisagara.geojson");
                    break;
                case "huye":
                    sectorDisplay("/assets/geojson/districts/Huye.geojson");
                    break;
                case "kamonyi":
                    sectorDisplay("/assets/geojson/districts/Kamonyi.geojson");
                    break;
                case "muhanga":
                    sectorDisplay("/assets/geojson/districts/Muhanga.geojson");
                    break;
                case "nyamagabe":
                    sectorDisplay("/assets/geojson/districts/Nyamagabe.geojson");
                    break;
                case "nyanza":
                    sectorDisplay("/assets/geojson/districts/Nyanza.geojson");
                    break;
                case "nyaruguru":
                    sectorDisplay("/assets/geojson/districts/Nyaruguru.geojson");
                    break;
                case "ruhango":
                    sectorDisplay("/assets/geojson/districts/Ruhango.geojson");
                    break;
                case "karongi":
                    sectorDisplay("/assets/geojson/districts/Karongi.geojson");
                    break;
                case "ngororero":
                    sectorDisplay("/assets/geojson/districts/Ngororero.geojson");
                    break;
                case "nyabihu":
                    sectorDisplay("/assets/geojson/districts/Nyabihu.geojson");
                    break;
                case "nyamasheke":
                    sectorDisplay("/assets/geojson/districts/Nyamasheke.geojson");
                    break;
                case "rubavu":
                    sectorDisplay("/assets/geojson/districts/Rubavu.geojson");
                    break;
                case "rusizi":
                    sectorDisplay("/assets/geojson/districts/Rusizi.geojson");
                    break;
                case "rutsiro":
                    sectorDisplay("/assets/geojson/districts/Rutsiro.geojson");
                    break;
                case "bugesera":
                    sectorDisplay("/assets/geojson/districts/Bugesera.geojson");
                    break;
                case "gatsibo":
                    sectorDisplay("/assets/geojson/districts/Gatsibo.geojson");
                    break;
                case "kayonza":
                    sectorDisplay("/assets/geojson/districts/Kayonza.geojson");
                    break;
                case "kirehe":
                    sectorDisplay("/assets/geojson/districts/Kirehe.geojson");
                    break;
                case "ngoma":
                    sectorDisplay("/assets/geojson/districts/Ngoma.geojson");
                    break;
                case "nyagatare":
                    sectorDisplay("/assets/geojson/districts/Nyagatare.geojson");
                    break;
                case "rwamagana":
                    sectorDisplay("/assets/geojson/districts/Rwamagana.geojson");
                    break;
            }

            legendS.addTo(map);
            infoS.addTo(map);
        }

    }
}