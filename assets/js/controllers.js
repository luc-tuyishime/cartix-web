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


myapp.controller('keyController', ['$scope','$http','$location','$routeParams','AuthService', function($scope,$http,$location,$routeParams,AuthService){
    console.log($routeParams.email, $routeParams.keyu);
    AuthService.Key($routeParams.email, $routeParams.keyu)
        .then(function(){
            console.log("edddee");
            var link = "/new-password/"+$routeParams.email;
            $location.path(link);
        })
        .catch(function(){
            $location.path('/signin');
        });
}]);


myapp.controller('changePasswordCtrl', ['$scope','$http','$location','$routeParams','AuthService', function($scope, $http, $location, $routeParams, AuthService){
    $scope.message = false;
    $scope.changePass= function(password, cpassword){
        if(password != cpassword){
            $scope.message = true;
        }else{
            AuthService.changePassword(password, $routeParams.email)
                .then(function(){
                    $location.path('/signin');
                })
                .catch(function(){
                    $scope.message = true;
                })
        }
    }
}]);


myapp.controller('forgetCtrl', ['$scope','$location','AuthService', function($scope, $location, AuthService){
    $scope.notValid = false;
    $scope.valid = false;
    $scope.recoverPass = function(email){
        console.log(email);
        AuthService.recover(email)
            .then(function(){
                $scope.valid = true;
            })
            .catch(function(){
                $scope.notValid = true;
            })
    }
}]);


myapp.controller('excelFileCtrl', ['$scope', 'Upload', '$timeout', '$window', '$http', '$location', 'AuthService', function($scope, Upload, $timeout, $window, $http, $location, AuthService) {
    $("body").removeClass('body-login');
    $("body").addClass('body-app');

    var ngo_id = restoreNgo();
    var url = "http://api.cartix.io/api/v1/ngo/" + ngo_id;

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


    $scope.uploadInput = true;
    $scope.box_data_one = true;
    $scope.box_data_two = false;
    $scope.spinLoad = false;

    //$scope.sg_number = 100;

    $scope.upload_File = function(file) {
        file.upload = Upload.upload({
            url: 'http://api.cartix.io/api/upload/',
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
                    $scope.uploadInput = true;
                    $scope.savepath = response.data.savepath;
                    $scope.filename = response.data.filename;
                } else {
                    closeNav();
                    openNav1();
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
            if (file.progress == 100){
                file.progress = -1;
                $scope.spinLoad = true;
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

        var data = '{"original":"' + original + '","save":"' + save + '","user_id":"' + id + '","filename":"' + filename + '"}';

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
        $scope.disabled = false;
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
        if (min_year == max_year){
             $scope.year_creation = min_year;
        }else{
             $scope.year_creation = min_year + " to " + max_year;
        }
       
        $scope.total_member = numeral(member.reduce(add, 0)).format();
        $scope.total_female = numeral(female.reduce(add, 0)).format();
        $scope.total_male = numeral(male.reduce(add, 0)).format();
        
        if(unique(partner) == 'N/A'){
            $scope.partner_number = 'N/A';
        }else{
            $scope.partner_number = unique(partner).length;
        }
        
        if (unique(ngo).length == 1){
            $scope.ngo_number = unique(ngo)[0];   
        }else{
            $scope.ngo_number = unique(ngo).length;
        }
        
        $scope.total_loan = numeral(loan.reduce(add, 0)).format();
        $scope.total_saved = numeral(saved.reduce(add, 0)).format();
        var status_dump = compressArray(status);
        console.log(status_dump);
        if (status_dump.length == 1){
            if (status_dump[0].value == 'Supervised') {
                $scope.supervised_num = numeral(status_dump[0].count).format();
                $scope.graduated_num = numeral(0).format();
            } else {
                $scope.supervised_num = numeral(0).format();
                $scope.graduated_num = numeral(status_dump[0].count).format();
            }  
        }else{
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

        var data = '{"original":"' + originalpath + '","save":"","user_id":"' + user_id + '","filename":"' + filename + '"}';

        $http.post('http://api.cartix.io/api/v1/file/user/', data, config)
            .success(function(data, status, header, config) {

                if (data.auth) {
                    console.log(data);
                    $("#side-content-data").hide();
                    $("#side-content-saved").show();
                }
            });


    }


    $scope.signout = function() {
        var destroy = destroyUser();
        if (destroy) {
            $location.path("/logout")

        }

    }




}]);




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
    location.reload();
}