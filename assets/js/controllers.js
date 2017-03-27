myapp.controller('appBgCtrl', ['$scope', function($scope) {
    $("body").removeClass('body-login');
    $("body").addClass('body-app');
}]);

myapp.controller('loginBgCtrl', ['$scope', function($scope) {
    $("body").removeClass('body-app');
    $("body").addClass('body-login');
}]);


myapp.controller('signupCtrl', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
    $scope.user = true;
    $scope.organization = false
    $scope.message = false;

    $scope.nextOrg = function(fullname, email, password) {
        $scope.user = false;
        $scope.organization = true;
        $scope.fullname = fullname;
        $scope.email = email;
        $scope.password = password;
    }

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
    $("body").removeClass('body-app');
    $("body").addClass('body-login');
    $scope.message = false;

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
    var url = "http://127.0.0.1:5000/api/v1/ngo/" + ngo_id;

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
            url: 'http://127.0.0.1:5000/api/upload/',
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

        $http.post('http://127.0.0.1:5000/api/v1/file/save/', data, config)
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

        $http.post('http://127.0.0.1:5000/api/v1/file/user/', data, config)
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




myapp.controller('mapCtrl', ['$scope', '$http', function($scope, $http) {

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
        $http.get('http://127.0.0.1:5000/api/v1/saving_year/')
            .success(function(data, status, header, config) {
                console.log(data);
                var options = '';
                $.each(data, function(key, value) {
                    options += "<option>" + value + "</option>";
                });

                $("#year").html(options);
                $("#year").multiselect('rebuild');

            });
    }


    // load int_ngo
    loadIntNgo();

    function loadIntNgo() {
        $http.get('http://127.0.0.1:5000/api/v1/int_ngo/')
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
        var url = "http://127.0.0.1:5000/api/v1/ngo/" + ngo_id;

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
        var url = 'http://127.0.0.1:5000/api/v1/user/' + user_id;

        $http.get(url)
            .success(function(data, status, header, config) {
                console.log(data);
                $scope.usernames_p = data.user.names;
            }).error(function(data, status, header, config) {

            });
    }



    // ########## Chart function ############

    chartFunction($http);


}]);




myapp.controller('notificationCtrl', ['$scope', '$http', 'AuthService', '$q', function($scope, $http, AuthService, $q) {

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
            var url = 'http://127.0.0.1:5000/api/v1/int_ngo/partner/' + int_ngo_filter;
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
            var url = "http://127.0.0.1:5000/api/v1/saving_year";
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
            var url = "http://127.0.0.1:5000/api/v1/files";
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
        $scope.notifAdmin = false;
        $scope.notifNgo = true;
        var user_id = localStorage.getItem('u___');

        // LoadAll files
        loadNgoFiles(user_id)

        function loadNgoFiles(user_id) {
            var url = "http://127.0.0.1:5000/api/v1/files/user/" + user_id;
            $http.get(url)
                .success(function(data, status, header, config) {
                    console.log(data);
                    $scope.files = data;
                })
                .error(function(data, status, header, config) {

                });
        }

        //loadInternational local Partner
        //loadLocalPartner(ngo_id);

        function loadLocalPartner(ngo_id) {
            console.log(ngo_id);
            var url = 'http://127.0.0.1:5000/api/v1/int_ngo/partner/' + ngo_id;
            $http.get(url)
                .success(function(data, status, header, config) {
                    var options = "";
                    $.each(data, function(key, value) {
                        options += "<option value='" + value.id + "'>" + value.name + "</option>";
                    });

                    $("#local_ngo").html(options);
                    $("#local_ngo").multiselect('rebuild');
                }).error(function(data, status, header, config) {

                })
        }

        // Load years
        loadFilesYear()

        function loadFilesYear() {
            var url = "http://127.0.0.1:5000/api/v1/saving_year";
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

    }

}]);




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
    loadProvinceSelectBox('#ddlCars13', $http);

    $("#ddlCars13").change(function(e) {
        var province_id = $("#ddlCars13").val().split(',')[0];
        loadDistrictSelectBox(province_id, '#ddlCars14', $http)
    });

    $("#ddlCars14").change(function(e) {
        var district_id = $("#ddlCars14").val().split(',')[0];
        loadSectorSelectBox(district_id, '#ddlCars15', $http);
    });


    function adminControllerData() {
        $scope.intlNgo = true;
        $scope.localNgo = false;
        $("#dataNgoHandler #changeColClass").removeClass("col-md-4").addClass("col-md-3");
        var idBox = "#ddlCars16";
        loadIntNgo(idBox, $http);


    }


    function intlNgoHandler(ngo_id) {
        $scope.intlNgo = true;
        $scope.localNgo = false;
        $("#dataNgoHandler #changeColClass").removeClass("col-md-4").addClass("col-md-3");
        var idBox = "#ddlCars16";
        loadIntNgo(idBox, $http);
    }

    function localNgoHandler(ngo_id) {
        $scope.intlNgo = false;
        $scope.localNgo = false;

        $("#dataNgoHandler #changeColClass").removeClass("col-md-3").addClass("col-md-4");

    }

}]);


// International NGO

function loadIntNgo(idBox, $http) {
    $http.get('http://127.0.0.1:5000/api/v1/int_ngo/')
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
    $http.get('http://127.0.0.1:5000/api/v1/kenessa/province/province/all')
        .success(function(data, status, header, config) {
            console.log(data);
            var options = "";
            $.each(data, function(key, value) {
                options += "<option selected value=" + [value.id, value.name] + " >" + value.name + "</option>";
            });
            $(idBox).html(options);
            $(idBox).multiselect('rebuild');
            $(idBox).multiselect({
                includeSelectAllOption: true
            });

        });
}



function loadDistrictSelectBox(province_id, idBox, $http) {
    $http.get('http://127.0.0.1:5000/api/v1/kenessa/province/district/' + province_id)
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
    var url = 'http://127.0.0.1:5000/api/v1/kenessa/district/sector/' + district_id;
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
    var windowHeight = ($(window).height());
    $("#call-opacity").css("height", windowHeight);
    document.getElementById("mySidenav").style.width = "50%";
    document.body.style.backgroundColor = "#fff";
    document.getElementById("call-opacity").className = "opacity";
}

function closeNav() {
    var windowHeight = ($(window).height());
    $("#call-opacity").css("height", 0);
    document.getElementById("mySidenav").style.width = "0";
    document.body.style.backgroundColor = "white";
    document.getElementById("call-opacity").className = "";
}

function openNav1() {
    var windowHeight = ($(window).height());
    $("#call-opacity").css("height", windowHeight);
    document.getElementById("mySidenav1").style.width = "50%";
    document.body.style.backgroundColor = "#fff";
    document.getElementById("call-opacity").className = "opacity";
}

function closeNav_() {
    var windowHeight = ($(window).height());
    $("#call-opacity").css("height", 0);
    document.getElementById("mySidenav1").style.width = "0";
    document.body.style.backgroundColor = "#fff";
    document.getElementById("call-opacity").className = "";
    location.reload();
}


function openNav2() {
    var windowHeight = ($(window).height());
    $("#call-opacity").css("height", windowHeight);
    $("#mySidenav2").css({
        "width": "50%",
        "background-color": "#fff"
    });
    $("#call-opacity").addClass("opacity");
}

function closeNav2() {
    var windowHeight = ($(window).height());
    $("#call-opacity").css("height", windowHeight);
    $("#mySidenav2").css({
        "width": "0%",
        "background-color": "#fff"
    });
    $("#call-opacity").removeClass("opacity");
}




function chartFunction($http) {


    // MEMBERSHIP PER GENDER

    var url = 'http://127.0.0.1:5000/api/v1/chartanalytics'
    $http.get(url)
        .success(function(data, status, header, config) {

            // Membership Pie

            var layout = {
                autosize: true,
                showlegend: false,
                margin: {
                    l: 0,
                    r: 0
                },
                title: 'Membership per Gender'
            };

            Plotly.newPlot('container_pie', data.membership, layout);


            // Saving Group Status per Intl NGos

            var layout_bar = {
                barmode: 'group',
                autosize: true,
                showlegend: false,
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
                title: 'SVGS_status per Intl NGOs',
            };

            Plotly.newPlot('container', data.status, layout_bar, {
                showLegend: false
            });


            /* SG Savings and Loans per Intl Ngos 
                  layout_bar will be inherited
            */

            Plotly.newPlot('container_saving_loan', data.amount, layout_bar);

        })
        .error(function(data, status, header, config) {
            console.log(status);
        });



    // SVGs_creation year per Internatonal NGOs
    var url = 'http://127.0.0.1:5000/api/v1/analytics/creation';
    $http.get(url)
        .success(function(data, status, header, config){
            console.log(data.creation);
            var layout = {
                title: 'SGs Creation year/Internatonal NGOs',
                barmode: 'group',
                autosize: true,
                showlegend: false,
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
                }
            };
            Plotly.newPlot('container_year_sg', data.creation, layout);
            
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
    // http://127.0.0.1:5000/api/v1/sqlsaving
    // assets/geojson/stats.json

    /*function jsonData(handleData){
        $.getJSON('http://127.0.0.1:5000/api/v1/sqlsaving', function(data) {
            //console.log(data);
            handleData(data);
        }); 
    }
    
    jsonData(function(output){
       Jsonfile = output; 
    }); */




    var url, sg_ngo;
    url = 'http://127.0.0.1:5000/api/v1/sqlsaving/1/1';
    $("#saving_group_map").change(function() {
        sg_ngo = $("#saving_group_map").val();
        year = $("#year").val();
        url = 'http://127.0.0.1:5000/api/v1/sqlsaving/' + sg_ngo + '/' + year;

    });

    console.log(year);



    $("#year").change(function() {
        var sg_ngo = $("#saving_group_map").val();
        var year = $("#year").val();
        console.log(sg_ngo);
        console.log(year);
        url = 'http://127.0.0.1:5000/api/v1/sqlsaving/' + sg_ngo + '/' + year;
    });



    function AjaxSgData(url) {
        $.ajax({
            url: url,
            async: false,
            success: function(data) {
                Jsonfile = data;
            }
        });
        console.log(url);
        return Jsonfile;
    }

    Jsonfile = AjaxSgData(url);




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
                geojson = L.geoJson(rwandaData, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
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
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
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
                var mm = obj.Membership;
                var f = obj.Female;
                var ml = obj.Male;
                var dens = obj.Density;
                var banks = obj.Male;
                var mfi = obj.Male;
                var nu = obj.Male;
                var u = obj.Male;
                var tl = obj.Male;
                var ba = obj.Male;
                info.update(layer.feature.properties, dens, mm, f, ml, banks, mfi, nu, u, tl, ba);
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
    info.update = function(props, density, membr, fem, male, banks, mfi, nu, u, tl, ba) {

        this._div.innerHTML = '<h4>Saving groups per Province</h4>' + (props ?
            '<b>' + props.Name + ' Province</b><br />' + density + ' Saving groups<br/> <b> Total Membership: </b>' + membr + '<br/> <b> Total Female: </b>' + fem + ' <br/> <b>Total Male: </b>' + male + '</br><b> Banks: </b>' + banks + '</br><b>MFIs: </b>' + mfi + '</br><b> Non-Umurenge: </b>' + nu + '</br><b> Umurenge:</b>' + u + '</br><b>Telco Agents: </b>' + tl + '</br><b>Bank Agents:</b>' + ba + '</br>' :
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
                geojson = L.geoJson(rwandaData, {
                    style: styleP,
                    onEachFeature: onEachFeatureP
                }).addTo(map);
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
                    style: styleP,
                    onEachFeature: onEachFeatureP
                }).addTo(map);
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
                geojson = L.geoJson(rwandaData, {
                    style: styleP,
                    onEachFeature: onEachFeatureKP
                }).addTo(map);
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
                    style: styleP,
                    onEachFeature: onEachFeatureKP
                }).addTo(map);
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
                var mm1 = obj.Membership;
                var f1 = obj.Female;
                var ml1 = obj.Male;
                var dens = obj.Density;
                var banks = obj.Male;
                var mfi = obj.Male;
                var nu = obj.Male;
                var u = obj.Male;
                var tl = obj.Male;
                var ba = obj.Male;
                infoP.update(layer.feature.properties, dens, mm1, f1, ml1, banks, mfi, nu, u, tl, ba);
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
    infoP.update = function(props, density, membr, fem, male, banks, mfi, nu, u, tl, ba) {
        this._div.innerHTML = '<h4>Saving groups in each District per Province</h4>' + (props ?
            '<b>' + props.Name + ' Province</b><br />' + density + ' Saving groups<br/> <b> Total Membership: </b>' + membr + '<br/> <b> Total Female: </b>' + fem + ' <br/> <b>Total Male: </b>' + male + '</br><b> Banks: </b>' + banks + '</br><b>MFIs: </b>' + mfi + '</br><b> Non-Umurenge: </b>' + nu + '</br><b> Umurenge:</b>' + u + '</br><b>Telco Agents: </b>' + tl + '</br><b>Bank Agents:</b>' + ba + '</br>' :
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
                geojson = L.geoJson(rwandaData, {
                    style: styleD,
                    onEachFeature: onEachFeatureD
                }).addTo(map);
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
                    style: styleD,
                    onEachFeature: onEachFeatureD
                }).addTo(map);
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

                var mm = obj.Membership;
                var f = obj.Female;
                var ml = obj.Male;
                var dens = obj.Density;
                var banks = obj.Male;
                var mfi = obj.Male;
                var nu = obj.Male;
                var u = obj.Male;
                var tl = obj.Male;
                var ba = obj.Male;
                infoD.update(layer.feature.properties, dens, mm, f, ml, banks, mfi, nu, u, tl, ba);
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
    infoD.update = function(props, density, membr, fem, male, banks, mfi, nu, u, tl, ba) {
        this._div.innerHTML = '<h4>Saving groups per District</h4>' + (props ?
            '<b>' + props.Name + ' District</b><br />' + density + ' Saving groups <br/> <b> Total Membership: </b>' + membr + '<br/> <b> Total Female: </b>' + fem + ' <br/> <b>Total Male: </b>' + male + '</br><b> Banks: </b>' + banks + '</br><b>MFIs: </b>' + mfi + '</br><b> Non-Umurenge: </b>' + nu + '</br><b> Umurenge:</b>' + u + '</br><b>Telco Agents: </b>' + tl + '</br><b>Bank Agents:</b>' + ba + '</br>' :
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
            });
        }

    }

    function sectorDisplay(geofile) {

        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: styleS,
                    onEachFeature: onEachFeatureS
                }).addTo(map);
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
                    onEachFeature: onEachFeatureS
                }).addTo(map);
            });
        }

    }

    function kigaliDisplay(geofile) {

        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: styleS,
                    onEachFeature: onEachFeaturekigali
                }).addTo(map);
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
                    onEachFeature: onEachFeaturekigali
                }).addTo(map);
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
                    var mm = obj.Membership;
                    var f = obj.Female;
                    var ml = obj.Male;
                    var dens = obj.Density;
                    var banks = obj.Male;
                    var mfi = obj.Male;
                    var nu = obj.Male;
                    var u = obj.Male;
                    var tl = obj.Male;
                    var ba = obj.Male;
                    infoS.update(layer.feature.properties, dens, mm, f, ml, banks, mfi, nu, u, tl, ba);
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
    infoS.update = function(props, density, membr, fem, male, banks, mfi, nu, u, tl, ba) {
        this._div.innerHTML = '<h4>Saving groups per Sector</h4>' + (props ?
            '<b>' + props.Name + ' Sector</b><br />' + density + ' Saving groups <br/> <b> Total Membership: </b>' + membr + '<br/> <b> Total Female: </b>' + fem + ' <br/> <b>Total Male: </b>' + male + '</br><b> Banks: </b>' + banks + '</br><b>MFIs: </b>' + mfi + '</br><b> Non-Umurenge: </b>' + nu + '</br><b> Umurenge:</b>' + u + '</br><b>Telco Agents: </b>' + tl + '</br><b>Bank Agents:</b>' + ba + '</br>' :
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