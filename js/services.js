/**
 * Services 
 */

// Service to ensure Cordova is ready
app.factory('CordovaReadyService', [
  '$q',
	function($q) {
		return function(scope) {
			var deferred = $q.defer(); 
			document.addEventListener('deviceready', function() {
				if(scope){
					scope.$apply(function(){
						deferred.resolve();
					});
				}else{
					deferred.resolve();
				}
			}, false);
			return deferred.promise;
		};
	}])
// Service handling Ajax request to the Wordpress backend
.factory('JsonService', function($resource, UserService){
  return $resource('http://www.bfcretailgroup.com/wordpress/api/:controller/:action/', {}, {
    auth_query: {method:'GET', params:{cookie:UserService.getCookie() } },
    cache_query: {method:'GET', params:{}, cache: true},
    query: {method:'GET', params:{cookie: UserService.getCookie() }, cache: true}
  });
})
// User status factory
.factory('UserService', function($http, $localStorage) {
	var _this = this;
	this.logged = $localStorage.isLogged;
	this.username = null;
	this.password = null;
	this.AuthCookie = $localStorage.AuthCookie;
	function getNonce() {
		var apiURL ="http://www.bfcretailgroup.com/wordpress/api/";
		$http.get(apiURL + "core_auth/get_nonce/?controller=auth&method=generate_auth_cookie").success(function(data) {
			var nonce = [];
			angular.forEach(data, function(value, key){
			  if(key == "nonce")
			  	this.push(value);
			}, nonce);
			generateCookie(nonce);
		}).
  error(function(data, status, headers, config) {
    console.log(config)
  })
	};
	function generateCookie(nonce) {
		var apiURL ="http://www.bfcretailgroup.com/wordpress/api/";
		var pwd = encodeURIComponent(_this.password);
		$http.get(apiURL + "auth/generate_auth_cookie/?nonce=" + nonce + "&username=" + _this.username + "&password=" + pwd).success(function(data) {
			var c = [];
			console.log(data)
			angular.forEach(data, function(value, key){
			  if(key == "cookie"){
			  	$localStorage.AuthCookie = encodeURIComponent(value);
			  	$localStorage.isLogged = true;
			  	_this.logged = true;
			  }
			});
		})
	}
	return {
		isLogged: function() {
			return _this.logged;
		},
		getName: function() {
			return _this.username;
		},
		getCookie: function() {
			return decodeURIComponent(_this.AuthCookie);
		},
		login: function( uname, pwd, callback) {
			_this.username = uname;
			_this.password = pwd;
			getNonce();
		},
		logout: function() {
			_this.username = null;
			_this.password = null;
			delete $localStorage.AuthCookie;
			delete $localStorage.isLogged;
			_this.logged = false;
		}
	}
})
.service('sharedPropertiesService', function () {
    var categories = {};

    return {
        getCategories: function () {
            return categories;
        },
        setCategories: function(value) {
            categories = value;
        }
    };
});