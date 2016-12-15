myapp.factory('AuthService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {

    // config variable for http post
    var config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }


    // create user variable
    var user = null;

    //return available function for use in controller
    return ({
        registerNgo: registerNgo,
        registerUser: registerUser,
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        getUserStatus: getUserStatus,
        getNgo: getNgo,
        destroyUser: destroyUser,
        Key: Key,
        changePassword: changePassword,
        recover:recover
    });


    function isLoggedIn() {
        if (user) {
            return true;
        } else {
            return false;
        }
    }

    function login(data) {
        // create new instance for deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('http://178.62.11.94:5000/api/v1/login/', data, config)
            // handle success
            .success(function(data, status) {
                if (status == 200 && data.result) {
                    user = true;
                    storeUser(data.result);
                    deferred.resolve();
                } else {
                    user = false;
                    console.log(user);
                    deferred.reject();
                }
            })
            .error(function(data) {
                user = false;
                console.log(user);
                deferred.reject();
            });

        // return promise object
        return deferred.promise;
    }


    function logout() {
        // create new instance for deferred
        var deferred = $q.defer();

        // destroy session

        var destroy = destroyUser();
        if (destroy) {
            user = false;
            deferred.resolve();
        } else {
            user = false;
            deferred.reject();
        }

        return deferred.promise;

    }



    function registerNgo(org_name, org_type) {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request data ngo
        var data = '{"name":"' + org_name + '","category":"' + org_type + '"}';

        $http.post('http://178.62.11.94:5000/api/v1/ngo/', data, config)
            .success(function(data, status) {
                if (status == 200 && data.result) {
                    saveNgo(data.result);
                    deferred.resolve();
                    console.log(data.result);
                } else {
                    deferred.reject();
                }
            })
            .error(function(data) {
                deferred.reject();
            });

        return deferred.promise;


    }
    
    
    function Key(email, key){
        var deferred = $q.defer();
        
        // send a put request
        var link = 'http://178.62.11.94:5000/api/v1/check/key/'+email+'/'+key;
        $http.get(link)
            .success(function(data,status){
                if(status == 200 && data.result){
                  deferred.resolve();  
                } else{
                    deferred.reject();
                }
            })
            .error(function(){
                deferred.reject();
            });
        return deferred.promise;
            
        
    }
    
    function changePassword(password, email){
        var deferred = $q.defer();
        
        var data = '{"password":"'+password+'", "email":"'+email+'"}';
        
        //send post request 
        $http.put('http://178.62.11.94:5000/api/v1/change/password', data, config)
            .success(function(data, status){
                if(status == 200 && data.result){
                    console.log(data.result);
                    deferred.resolve();
                }else{
                    deferred.reject();
                }
            })
            .error(function(){
                deferred.reject();
            });
        return deferred.promise;
    }
    
    
    function recover(email){
        var deferred = $q.defer();
        var link = 'http://178.62.11.94:5000/api/v1/recover/'+email;
        
        //send get request
        $http.get(link)
            .success(function(data, status){
                if(status == 200 && data.result){
                    console.log(data.result);
                    deferred.resolve();
                }else{
                    deferred.reject();
                }
            })
            .error(function(){
                deferred.reject();
            });
        return deferred.promise;
    }

    function registerUser(fullname, email, password, ngo_id) {
        // create new instance of deferred
        var deferred = $q.defer();

        // send a post request data ngo
        var data = '{"names":"' + fullname + '","email":"' + email + '","password":"' + password + '", "ngo_id":"' + ngo_id + '"}';
        $http.post('http://178.62.11.94:5000/api/v1/user/', data, config)
            .success(function(data, status) {
                if (status == 200 && data.result) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })
            .error(function() {
                deferred.reject();
            });
        return deferred.promise;
    }


    function getUserStatus() {
        var restore = restoreUser();
        if (restore) {
            user = true;

        } else {
            user = false;
        }
        return user;
    }



    function saveNgo(id) {
        localStorage.setItem('n___', id);
    }


    function getNgo() {
        var ngo_id = localStorage.getItem('n___');
        return ngo_id;
    }

    function storeUser(User) {
        localStorage.setItem('u___', User);
        return true;
    }

    function restoreUser() {
        var user_id = localStorage.getItem('u___');
        if (user_id) {
            return true
        } else {
            return false;
        }
    }

    function destroyUser() {
        localStorage.removeItem('u___');
        return true;
    }

}]);